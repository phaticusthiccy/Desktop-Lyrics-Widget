[cmdletbinding()]
param()

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$WinRtType = [System.Type]::GetType("Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType=WindowsRuntime")
if (-not $WinRtType) {
    Write-Output "{}"
    exit
}

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' 
})[0]

function AwaitTask($WinRtTask, $ResultType) {
    if (-not $WinRtTask) { return $null }
    try {
        $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
        $netTask = $asTask.Invoke($null, @($WinRtTask))
        $netTask.Wait(1500) | Out-Null
        return $netTask.Result
    } catch {
        return $null
    }
}

try {
    $reqMethod = $WinRtType.GetMethod("RequestAsync", [type[]]@())
    $mgrTask = $reqMethod.Invoke($null, @())
    $mgr = AwaitTask $mgrTask $WinRtType

    if (-not $mgr) {
        Write-Output "{}"
        exit
    }

    $currentSession = $mgr.GetCurrentSession()
    if (-not $currentSession) {
        $sessions = $mgr.GetSessions()
        if ($sessions -and $sessions.Count -gt 0) {
            $currentSession = $sessions[0]
        }
    }

    if (-not $currentSession) {
        Write-Output "{}"
        exit
    }

    $propType = [System.Type]::GetType("Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType=WindowsRuntime")
    $pTask = $currentSession.TryGetMediaPropertiesAsync()
    $props = AwaitTask $pTask $propType

    $timeline = $currentSession.GetTimelineProperties()
    $playback = $currentSession.GetPlaybackInfo()

    $status = "Unknown"
    if ($playback) {
        $status = $playback.PlaybackStatus.ToString()
    }

    $posSec = 0
    $durSec = 0
    if ($timeline) {
        $rawPos = $timeline.Position.TotalSeconds
        $durSec = [math]::Round($timeline.EndTime.TotalSeconds, 2)

        # Calculate actual live position by factoring in elapsed time since LastUpdatedTime
        if ($status -eq "Playing" -and $timeline.LastUpdatedTime) {
            $nowUtc = [System.DateTimeOffset]::UtcNow
            $elapsedSec = ($nowUtc - $timeline.LastUpdatedTime).TotalSeconds
            if ($elapsedSec -gt 0 -and $elapsedSec -lt 86400) {
                $rawPos += $elapsedSec
            }
        }

        if ($durSec -gt 0 -and $rawPos -gt $durSec) {
            $rawPos = $durSec
        }

        $posSec = [math]::Round([math]::Max(0, $rawPos), 2)
    }

    $title = if ($props -and $props.Title) { $props.Title } else { "" }
    $artist = if ($props -and $props.Artist) { $props.Artist } else { "" }
    $app = $currentSession.SourceAppUserModelId

    $res = [PSCustomObject]@{
        title = $title
        artist = $artist
        app = $app
        status = $status
        position = $posSec
        duration = $durSec
    }

    $res | ConvertTo-Json -Compress
} catch {
    Write-Output "{}"
}
