
2025-10-30 21:58

Tags: [[git]], [[revature]]

# Revature First Day Notes
Richard Hawkins
- Richard.Hawkins@Revature.com
- 908-310-9058

## Git Bash
kenne@kenneth-laptop MINGW64 ~

`kenne` is the user
`kenneth-laptop` is the name of device
`MINGW64` is the compiler

~ directory:
- your home directory: you set this as your default
- top of your tree structure of your files (root directory?)
- `pwd` print working directory

Bash (on the far right) prints your working directory

- any path that starts with the / is an absolute path
- relative path: ./ will represent your current directory. you can use it to navigate to previous and sub directories
- ./.. allows you to backtrack to the previous directory before your current working directory
- why is the  /c drive not in the root directory? 
- -l formats the files into links
- `-a` includes all the hidden files

Why use git bash? anything you can do in a gui you can do in terminal

## Creating/Editing files in Bash
navigating, you can use tab to complete file locations if it is unique enough
`mkdir` - make a directory
`touch` - originally meant to update a file, however it can also use it to create files
`rmdir` or `rm` - meant to delete directory
- use `-r` to remove recursively 
- use `-f` to
`cat` - checking what's written in a file
`.md` extension will give it an extra bit of styling with specific shorthand (kind of like obsidian shorthand)

## Git
decentralized version control system tool
Github - is the cloud service provider for storing your files

### Creating a Git Repo Locally
using `which` you can double check to see if you have certain software installed
- which git would display /mingw64/bin/git
`clone` 
`git init` - create or reinitialize a new repo
**restarting a git repo is fine. it's better to restart than to succumb to sunk cost**

with which, if you have 2 executables w same name what happens?
- you need to specify location of the executable

`git status` - lets us know what's going on in our repo
`git log` - check commits
`HEAD` is the start of the earliest version available to you

write some notes on push remote origin, pull

## Git Basic Good Practice
- commit early and often
- pull before you push **IMPORTANT**
- git status every step of the way
- consistent names are your friend
- SUNK COST FALACY

``` Bash
git log --graph

```

## .gitignore

- period in front of file hides it (needs ls -a to see it)

stuff to NOT ignore when committing
- source code, specific config

``` Java

int[] deck = new int[13]
int[] pHand = new int[10]
int[] dHand = new int[10]

// initiate players and dealers hand
for(2) {
	pHand[i] = hit(deck);
	dHand[i] = hit(deck);
}

// hitting and standing
while(playersturn) {
	
	switch(input) {
	case h: // hit
		pHand[i] = hit(deck);
		
		int sum;
		for(int : pHand) sum += pHand[i];
		
		if pHand > 21 {
			playersturn = false;
			playerbust = true;
		}
		
		break;
	case s: // stand
		playersturn = false;
		break;
	default:	
	
	}
}

// does not account for running out of a specific card
public static int hit (int deck[]) {
	if deckSize = 0 {
		reinitialize deck with 8 each
		loop through phand and decrement from deck
		loop through dhand and decrement from deck
	}

	while(notselect) {
		select = rand.nextInt(13);
		
		if (delect[select != 0]) notselect = true;
	}
	
	deck[select] --;
	deckSize --;
	return select;
}


```




# References