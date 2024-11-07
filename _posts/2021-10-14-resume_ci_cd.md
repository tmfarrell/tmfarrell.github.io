---
layout: post
title:  "Resume CI/CD with Google Docs and Github Pages"
date:   2021-10-14 07:47 
categories: 
---

Ever get frustrated by to keep your resume up-to-date on your Github Pages
website? Here's the process/ workflow I came up with to make that process easier using Google
Drive and some light automation.

1. [Create a Google Cloud Platform account](https://developers.google.com/workspace/guides/create-project) 
   (if you don't have one already), and enable the Google Drive API. 
   

2. [Configure the OAuth consent screen](https://developers.google.com/workspace/guides/create-credentials#configure_the_oauth_consent_screen) 
   for a Desktop application. Also make sure that all of the Google Drive APIs are in scope for this application. 


3. [Create an OAuth client ID credential](https://developers.google.com/workspace/guides/create-credentials#create_a_oauth_client_id_credential) 
   and download the JSON locally to `credentials.json`. 
   
   
4. Create a `conda` environment with the necessary dependencies by doing 

   ```bash
   $ conda env create -n website-ci
   $ conda install -n website-ci -c conda-forge \
        google-api-python-client \
        google-auth-httplib2 google-auth-oauthlib
   ```

   You should also consider exporting this environment as a yaml (`conda env export --name webite-ci > website-ci.conda.yml`), 
   so you can easily load it later (`conda  env create --file website-ci.conda.yml`).  
   
   (**Note:** if you don't have `conda` you can install it [here](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html).)


5. Add the following script to `scripts/download_document.py`: 

   ```python 
   from __future__ import print_function
   import os.path
   
   from googleapiclient.discovery import build
   from googleapiclient.http import MediaIoBaseDownload
   from google_auth_oauthlib.flow import InstalledAppFlow
   from google.auth.transport.requests import Request
   from google.oauth2.credentials import Credentials
   
   # If modifying these scopes, delete the file token.json.
   SCOPES = ['https://www.googleapis.com/auth/drive']
   
   # The ID of a document 
   DOCUMENT_ID = '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE' 
   
   def main():
       """Downloads document as .pdf"""
       creds = None
       if os.path.exists('token.json'):
           creds = Credentials.from_authorized_user_file('token.json', SCOPES)
           # If there are no (valid) credentials available, let the user log in.
       if not creds or not creds.valid:
           if creds and creds.expired and creds.refresh_token:
               creds.refresh(Request())
           else:
               flow = InstalledAppFlow.from_client_secrets_file(
                   'credentials.json', SCOPES)
               creds = flow.run_local_server(port=0)
           # Save the credentials for the next run
           with open('token.json', 'w') as token:
               token.write(creds.to_json())
   
       service = build('drive', 'v3', credentials=creds)
   
       request = service.files().export_media(fileId=DOCUMENT_ID,
                                              mimeType='application/pdf')
       with open('document.pdf', 'wb') as fh:
           downloader = MediaIoBaseDownload(fh, request)
           done = False
           while done is False:
               status, done = downloader.next_chunk()


   if __name__ == '__main__':
      main()
   ```
   Where the `DOCUMENT_ID` should point to your resume on Google Drive. (**Note:** You can find the 
   document ID of any Google Docs document URL, like `https://docs.google.com/document/d/<document ID>/`). 
   And `document.pdf` should be the local path to your resume within your Github Pages site. 
   
   

6. Then add a `make` command like this: 

   ```makefile
   DATETIME=$(shell date)

   update:
       python3 scripts/download_document.py
       git add document.pdf
       git commit -m "updated document: $(DATETIME)"
       git push
   ```
   
Now whenever you want to update your resume after making changes, just do `make update` and 
those will automatically be reflected on your website resume.


