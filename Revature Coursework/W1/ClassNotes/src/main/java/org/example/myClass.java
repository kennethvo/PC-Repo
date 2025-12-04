package org.example;

public class myClass {
    // fields
    public int guessesRemaining;
    private char currentGuess;
    protected String secretWord;
    char[] previousGuesses;
    String hiddenWord;
    String finalGuess;
    int i = 0;

    // methods
    boolean ValidateInput(String userInput){return true;}
    String DisplayHiddenWord(){return "";}
    void DecrementGuessesRemaining(){
        i = 1;
    }
    boolean CheckGuess(){
    //I'll add some things here
        i++;
        return false;
    }
    void DisplayGallows(){}
    void DisplayPreviousGuesses(){}
    String UpdateHiddenWord(){return "";}
}
