[cmdletbinding()]
param(
    [string]$action = "playpause"
)

Add-Type -AssemblyName System.Runtime.WindowsRuntime

$WinRtType = [System.Type]::GetType("Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType=WindowsRuntime")

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' 
})[0]

function AwaitTask($WinRtTask, $ResultType) {
    if (-not $WinRtTask) { return $null }
    try {
        $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
        $netTask = $asTask.Invoke($null, @($WinRtTask))
        $netTask.Wait(1000) | Out-Null
        return $netTask.Result
    } catch {
        return $null
    }
}

$success = $false
$isBrowser = $false

if ($WinRtType) {
    try {
        $reqMethod = $WinRtType.GetMethod("RequestAsync", [type[]]@())
        $mgrTask = $reqMethod.Invoke($null, @())
        $mgr = AwaitTask $mgrTask $WinRtType

        if ($mgr) {
            $currentSession = $mgr.GetCurrentSession()
            if (-not $currentSession) {
                $sessions = $mgr.GetSessions()
                if ($sessions -and $sessions.Count -gt 0) {
                    $currentSession = $sessions[0]
                }
            }

            if ($currentSession) {
                $appId = ""
                if ($currentSession.SourceAppUserModelId) {
                    $appId = $currentSession.SourceAppUserModelId.ToLower()
                }
                
                if ($appId -match "chrome|edge|firefox|opera|brave|msedge") {
                    $isBrowser = $true
                }

                $boolType = [System.Boolean]
                switch ($action) {
                    "playpause" {
                        $task = $currentSession.TryTogglePlayPauseAsync()
                        $res = AwaitTask $task $boolType
                        $success = [bool]$res
                    }
                    "next" {
                        $task = $currentSession.TrySkipNextAsync()
                        $res = AwaitTask $task $boolType
                        $success = [bool]$res
                    }
                    "previous" {
                        $task = $currentSession.TrySkipPreviousAsync()
                        $res = AwaitTask $task $boolType
                        $success = [bool]$res
                    }
                }
            }
        }
    } catch {}
}

# Fallback & Browser Enhancements via Win32 keybd_event
try {
    $Signature = @"
[DllImport("user32.dll")]
public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
"@
    $Keybd = Add-Type -MemberDefinition $Signature -Name "MediaKeysControlEx" -Namespace "Win32" -PassThru

    switch ($action) {
        "playpause" {
            if (-not $success) {
                $Keybd::keybd_event(0xB3, 0, 0, 0); $Keybd::keybd_event(0xB3, 0, 2, 0)
            }
        }
        "next" {
            # Send Global VK_MEDIA_NEXT_TRACK
            $Keybd::keybd_event(0xB0, 0, 0, 0); $Keybd::keybd_event(0xB0, 0, 2, 0)

            # If browser or GSMTC didn't handle it, also send Shift + N (YouTube / Web Next shortcut)
            if ($isBrowser -or -not $success) {
                Start-Sleep -Milliseconds 50
                $Keybd::keybd_event(0x10, 0, 0, 0) # VK_SHIFT down
                $Keybd::keybd_event(0x4E, 0, 0, 0) # VK_N down
                $Keybd::keybd_event(0x4E, 0, 2, 0) # VK_N up
                $Keybd::keybd_event(0x10, 0, 2, 0) # VK_SHIFT up
            }
        }
        "previous" {
            # Send Global VK_MEDIA_PREV_TRACK
            $Keybd::keybd_event(0xB1, 0, 0, 0); $Keybd::keybd_event(0xB1, 0, 2, 0)

            # If browser or GSMTC didn't handle it, also send Shift + P (YouTube / Web Previous shortcut)
            if ($isBrowser -or -not $success) {
                Start-Sleep -Milliseconds 50
                $Keybd::keybd_event(0x10, 0, 0, 0) # VK_SHIFT down
                $Keybd::keybd_event(0x50, 0, 0, 0) # VK_P down
                $Keybd::keybd_event(0x50, 0, 2, 0) # VK_P up
                $Keybd::keybd_event(0x10, 0, 2, 0) # VK_SHIFT up
            }
        }
    }
} catch {}
