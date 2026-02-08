$srcPath = "c:\Users\psrih\Downloads\medx\maths\src"
Get-ChildItem $srcPath -Recurse -Filter *.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace 'primary-', 'emerald-'
    Set-Content $_.FullName $newContent
}
Write-Host "Done replacing primary- with emerald-"
