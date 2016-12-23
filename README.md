# Manmanga

Awesome mangas and animes dedicated search engine.

## Run the project

### Prerequisites

You'll need the following technologies in order to build
and run the project:

* Node.js (and therefore npm)
* Typescript
* Gulp
* Webpack

**To install these tools:**

1. Download [NodeJS](https://nodejs.org/en/).
(Version 7.x if possible)
2. Run the following command:
    
    ```
    npm install -g typescript gulp webpack
    ```
    
    Note that on linux based systems,
    you'll need administrator rights.
    
### Build and run

1. Clone the project

    ```
    git clone https://github.com/if-h4102/man-manga.git
    cd man-manga
    ```
    
2. Install needed dependencies

    ```
    npm install
    ```
    
3. Build it

    ```
    gulp client:buid
    ```
    
4. Run it

    ```
    npm start
    ```
    
    And then go to the shown URL in your favorite browser
    (http://localhost:3000)

## Dev Notes

### Voice actors
When searching for character on dbpedia,
we often come across _voice actors_.
It could be nice to add them to the list of things that
we can search.

Moreover, people are fairly more documented in dbpedia than
fictional characters.

### Characters
Fictional characters are only well documents in dbpedia if
they are well known.
That's sad, but that's the truth.

To overcome this situation, we could force a second research
if the first one in wikipedia doesn't bring a character;
we could use anilist.o API `/character/search/{query}`.

### About time
There are a looooooot of awesome features to implement,
but to respect the deadline only the basic things will
be in the presentation.

I hope we will implement some more after the deadline.