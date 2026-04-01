$items = Get-ChildItem -Path src -Recurse -File -Include *.js

foreach ($item in $items) {
    Write-Host "Processing $($item.FullName)"
    $content = Get-Content -Path $item.FullName -Raw
    
    # 1. Standardize core folders to lowercase in require paths
    $patterns = @(
        'require\("(\.\.?/)[Cc]onfig/',
        'require\("(\.\.?/)[Cc]ontrollers/',
        'require\("(\.\.?/)[Mm]iddlewares/',
        'require\("(\.\.?/)[Mm]odels/',
        'require\("(\.\.?/)[Rr]equests/',
        'require\("(\.\.?/)[Rr]esources/',
        'require\("(\.\.?/)[Rr]outes/',
        'require\("(\.\.?/)[Uu]tils/',
        "require\('(\.\.?/)[Cc]onfig/",
        "require\('(\.\.?/)[Cc]ontrollers/",
        "require\('(\.\.?/)[Mm]iddlewares/",
        "require\('(\.\.?/)[Mm]odels/",
        "require\('(\.\.?/)[Rr]equests/",
        "require\('(\.\.?/)[Rr]esources/",
        "require\('(\.\.?/)[Rr]outes/",
        "require\('(\.\.?/)[Uu]tils/"
    )
    
    $replacements = @(
        'require("$1config/',
        'require("$1controllers/',
        'require("$1middlewares/',
        'require("$1models/',
        'require("$1requests/',
        'require("$1resources/',
        'require("$1routes/',
        'require("$1utils/',
        "require('$1config/",
        "require('$1controllers/",
        "require('$1middlewares/",
        "require('$1models/",
        "require('$1requests/",
        "require('$1resources/",
        "require('$1routes/",
        "require('$1utils/"
    )

    for ($i=0; $i -lt $patterns.Count; $i++) {
        $content = $content -replace $patterns[$i], $replacements[$i]
    }
    
    # 2. Fix subfolders in middlewares (Channel -> channel, Messages -> messages)
    $content = $content -replace 'middlewares/[Cc]hannel/', 'middlewares/channel/'
    $content = $content -replace 'middlewares/[Mm]essages/', 'middlewares/messages/'
    
    # 3. Replace old CheckValidationMiddleware with ResponseHandlerMiddleware
    $content = $content -replace 'CheckValidationMiddleware', 'ResponseHandlerMiddleware'
    $content = $content -replace 'ValidationMiddleware', 'ResponseHandlerMiddleware'
    
    Set-Content -Path $item.FullName -Value $content -NoNewline
}

Write-Host "Project-wide paths standardized and old middlewares replaced."
