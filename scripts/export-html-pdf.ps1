param(
  [Parameter(Mandatory=$true)][string]$HtmlPath,
  [Parameter(Mandatory=$true)][string]$PdfPath
)
$html=(Resolve-Path -LiteralPath $HtmlPath).Path
$pdf=[System.IO.Path]::GetFullPath($PdfPath)
$candidates=@(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)
$browser=$candidates|Where-Object{Test-Path -LiteralPath $_}|Select-Object -First 1
if(-not $browser){throw 'Microsoft Edge or Google Chrome was not found.'}
$uri=[System.Uri]::new($html).AbsoluteUri
$profile=Join-Path ([System.IO.Path]::GetTempPath()) ("consulting-pdf-"+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $profile -Force|Out-Null
$arguments=@('--headless=new','--disable-gpu','--disable-software-rasterizer','--disable-features=UseSkiaRenderer,Vulkan','--no-pdf-header-footer',("--user-data-dir="+$profile),("--print-to-pdf="+$pdf),$uri)
$process=Start-Process -FilePath $browser -ArgumentList $arguments -Wait -PassThru -WindowStyle Hidden
if(-not (Test-Path -LiteralPath $pdf)){throw 'PDF export failed.'}
Write-Output "PDF exported: $pdf"
