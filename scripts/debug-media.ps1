[cmdletbinding()]
param()

Add-Type -AssemblyName System.Runtime.WindowsRuntime

$WinRtType = [System.Type]::GetType("Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType=WindowsRuntime")
Write-Host "Type loaded via GetType: " ($WinRtType -ne $null)

if ($WinRtType) {
    $asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
        $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' 
    })[0]

    function AwaitTask($WinRtTask, $ResultType) {
        if (-not $WinRtTask) { return $null }
        try {
            $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
            $netTask = $asTask.Invoke($null, @($WinRtTask))
            $netTask.Wait(2000) | Out-Null
            return $netTask.Result
        } catch {
            Write-Host "AwaitTask error: "$_
            return $null
        }
    }

    $reqMethod = $WinRtType.GetMethod("RequestAsync", [type[]]@())
    $mgrTask = $reqMethod.Invoke($null, @())
    $mgr = AwaitTask $mgrTask $WinRtType

    Write-Host "Manager instance created: " ($mgr -ne $null)

    if ($mgr) {
        $currSession = $mgr.GetCurrentSession()
        Write-Host "Current session found: " ($currSession -ne $null)

        $sessions = $mgr.GetSessions()
        Write-Host "Total active sessions count: " $sessions.Count

        foreach ($s in $sessions) {
            Write-Host ">>> SESSION APP: " $s.SourceAppUserModelId
            $pTask = $s.TryGetMediaPropertiesAsync()
            $propType = [System.Type]::GetType("Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType=WindowsRuntime")
            $p = AwaitTask $pTask $propType
            if ($p) {
                Write-Host "    Title: " $p.Title
                Write-Host "    Artist: " $p.Artist
            }
        }
    }
}
