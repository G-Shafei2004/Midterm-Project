# BMW Explorer - zero-install localhost web server for Windows PowerShell 5.1+.
# Serves this extracted folder only, on 127.0.0.1, with HTML, scripts, photos and videos.
$ErrorActionPreference = 'Stop'
$port = 8000
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$prefix = $root.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
try {
    $listener.Start()
} catch {
    Write-Host ''
    Write-Host 'Port 8000 is already in use. A local BMW website server may already be running.' -ForegroundColor Yellow
    Write-Host 'Opening that local address. If it is another site, close its server and try again.'
    Start-Process 'http://127.0.0.1:8000/index.html'
    exit 0
}
Write-Host ''
Write-Host 'BMW Explorer is running!' -ForegroundColor Green
Write-Host 'Site: http://127.0.0.1:8000/index.html'
Write-Host 'Keep this window open while you use the site. Press Ctrl+C to stop.'
Write-Host ''
Start-Process 'http://127.0.0.1:8000/index.html'

function Send-Response([System.IO.Stream]$stream, [int]$status, [string]$description, [string]$contentType, [byte[]]$body) {
    $header = "HTTP/1.1 $status $description`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nCache-Control: no-store`r`nX-Content-Type-Options: nosniff`r`nConnection: close`r`n`r`n"
    $bytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($bytes, 0, $bytes.Length)
    if ($body.Length -gt 0) { $stream.Write($body, 0, $body.Length) }
}
function Mime([string]$extension) {
    switch ($extension.ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.css' { 'text/css; charset=utf-8' }
        '.js' { 'text/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.svg' { 'image/svg+xml' }
        '.jpg' { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.png' { 'image/png' }
        '.webp' { 'image/webp' }
        '.gif' { 'image/gif' }
        '.ico' { 'image/x-icon' }
        '.mp4' { 'video/mp4' }
        '.webm' { 'video/webm' }
        '.woff2' { 'font/woff2' }
        '.woff' { 'font/woff' }
        '.ttf' { 'font/ttf' }
        default { 'application/octet-stream' }
    }
}
try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $client.ReceiveTimeout = 8000
            $client.SendTimeout = 30000
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()
            if (-not $requestLine) { continue }
            $request = [regex]::Match($requestLine, '^(GET|HEAD)\s+(\S+)\s+HTTP/\d\.\d')
            if (-not $request.Success) {
                Send-Response $stream 405 'Method Not Allowed' 'text/plain' ([System.Text.Encoding]::UTF8.GetBytes('Only GET and HEAD requests are supported.'))
                continue
            }
            $method = $request.Groups[1].Value
            $urlPath = ($request.Groups[2].Value -split '\?', 2)[0]
            $rangeHeader = ''
            while ($true) {
                $headerLine = $reader.ReadLine()
                if (-not $headerLine) { break }
                if ($headerLine -match '^Range:\s*(.+)$') { $rangeHeader = $Matches[1] }
            }
            $relative = [Uri]::UnescapeDataString($urlPath).TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
            if (-not $relative) { $relative = 'index.html' }
            $path = [IO.Path]::GetFullPath((Join-Path $root $relative))
            if (-not $path.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) -or -not [IO.File]::Exists($path)) {
                Send-Response $stream 404 'Not Found' 'text/plain' ([System.Text.Encoding]::UTF8.GetBytes('File not found.'))
                continue
            }
            $file = [IO.File]::OpenRead($path)
            try {
                $total = $file.Length
                $start = [long]0
                $end = $total - 1
                $status = '200 OK'
                $extra = ''
                $m = [regex]::Match($rangeHeader, '^bytes=(\d+)-(\d*)$')
                if ($m.Success -and $total -gt 0) {
                    $start = [long]::Parse($m.Groups[1].Value)
                    if ($m.Groups[2].Value) { $end = [Math]::Min($end, [long]::Parse($m.Groups[2].Value)) }
                    if ($start -gt $end -or $start -ge $total) {
                        Send-Response $stream 416 'Range Not Satisfiable' 'text/plain' ([byte[]]@())
                        continue
                    }
                    $status = '206 Partial Content'
                    $extra = "Content-Range: bytes $start-$end/$total`r`n"
                }
                $length = $end - $start + 1
                $type = Mime ([IO.Path]::GetExtension($path))
                $header = "HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $length`r`nAccept-Ranges: bytes`r`n${extra}Cache-Control: no-store`r`nX-Content-Type-Options: nosniff`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                if ($method -ne 'HEAD') {
                    [void]$file.Seek($start, [IO.SeekOrigin]::Begin)
                    $buffer = New-Object byte[] 65536
                    $remaining = $length
                    while ($remaining -gt 0) {
                        $toRead = [int][Math]::Min([long]$buffer.Length, $remaining)
                        $count = $file.Read($buffer, 0, $toRead)
                        if ($count -le 0) { break }
                        $stream.Write($buffer, 0, $count)
                        $remaining -= $count
                    }
                }
            } finally { $file.Dispose() }
        } catch {
            Write-Host "Request failed: $($_.Exception.Message)" -ForegroundColor DarkYellow
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
