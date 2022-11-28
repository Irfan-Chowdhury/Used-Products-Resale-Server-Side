<div align='center'>

# E-Recycle-Phone
</div>


## `Hosting Procedure in vercel`

#### 1. Update `package.json` file
```bash
  "scripts": {
    "start":"node index.js",
    "start-dev":"nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

#### 2. Create  `vercel.json` file in root directory and copy-paste the bellow code
```bash
{
    "version": 2,
    "builds": [
        {
            "src": "./index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/"
        }
    ]
}
```


#### 3. Open terminal and command this word follow instruction step by step
```bash
vercel
```
- A question will apear that ***Set up and deploy ?***. Type `y` means (yes). Follow the screenshot.

    <img alt="Coding" height="20px"  src="https://snipboard.io/dPDcgu.jpg"/>

- ***Which scope do you want to deploy to?***  press `Enter`

    <img alt="Coding" height="20px" src="https://snipboard.io/qhoDPi.jpg"/>

- ***Link to existing project ?*** type `n`

    <img alt="Coding" height="20px"  src="https://snipboard.io/skXvZz.jpg"/>


- ***What’s your project’s name? (xyz-server)*** Press `Enter`

    <img alt="Coding" height="20px"  src="https://snipboard.io/aW38Ae.jpg"/>


- ***In which directory is your code located? ./*** Press `Enter`

    <img alt="Coding" height="20px"  src="https://snipboard.io/fKZRWm.jpg"/>

- Then it takes few seconds, then you will get a production link like https://xyz-server.vercel.app/ and check in browser.

- Then after any changing, every time you have to use this command -
    ```bash
    vercel --prod
    ```

