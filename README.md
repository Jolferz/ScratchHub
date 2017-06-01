ScratchHub

To run the project you need to download and install MongoDB:



MongoDB download center: https://www.mongodb.com/download-center#community

1. OS X instructions (with Homebrew): http://bit.ly/2rf9tbu  
2. Windows instructions: http://bit.ly/2h8rx39


To run the database, you need to execute "mongod" located where all the MongoDB files where saved at the moment of installation.


The following is not necessary, but if you want to access the database then run the command "mongo" in the terminal. Here is a short list of useful commands of the database:

1. show dbs: lists all existing databases
2. use [db name]: enters the specified database
3. show collections: lists all collections
4. db.[collection name].find({}).pretty(): shows you all existing collections in the database
5. db.[collection name].remove({}): removes all existing collections from the database


After the database is up and running, open a terminal window and go to the projects main directory. Run the following commands:

1. npm install: this will download all the project's dependencies
2. nodemon: this will run the application (to stop it do ctrl + c)

Lastly, open a browser window and load url "localhost:3000" and you should be seeing the website.
