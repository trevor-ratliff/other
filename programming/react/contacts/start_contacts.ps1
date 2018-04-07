####
# start the contacts app by starting the json-server, then running npm start in the correct folders
####

cd .\api
Start-Process -FilePath json-server -ArgumentList "-p","3001","--id","number","--watch",".\db.json"

cd ..
Start-Process -FilePath npm -ArgumentList "start"

Write-Host "done"
