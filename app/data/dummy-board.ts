import { GameBoard } from "../types";

export const dummyBoard: GameBoard = {
  categories: [
    {
      name: "U.S. History",
      clues: [
        { value: 100, question: "This U.S. president issued the Emancipation Proclamation.", answer: "Who is Abraham Lincoln?" },
        { value: 200, question: "This war was fought between the North and South regions in the United States.", answer: "What is the Civil War?" },
        { value: 300, question: "This ancient civilization built Machu Picchu.", answer: "Who are the Incas?" },
        { value: 400, question: "This document was signed in 1215 limiting the power of the English monarchy.", answer: "What is the Magna Carta?" },
        { value: 500, question: "This queen ruled England for 63 years during the 19th century.", answer: "Who is Queen Victoria?" },
      ],
    },
    {
      name: "World History",
      clues: [
        { value: 100, question: "This empire was ruled by Genghis Khan.", answer: "What is the Mongol Empire?" },
        { value: 200, question: "This ancient city is known for its hanging gardens.", answer: "What is Babylon?" },
        { value: 300, question: "This war was sparked by the assassination of Archduke Franz Ferdinand.", answer: "What is World War I?" },
        { value: 400, question: "This wall divided East and West Berlin from 1961 to 1989.", answer: "What is the Berlin Wall?" },
        { value: 500, question: "This revolution began in 1789 and led to the rise of Napoleon Bonaparte.", answer: "What is the French Revolution?" },
      ],
    },
    {
      name: "Pop Culture",
      clues: [
        { value: 100, question: "This superhero is known as the 'Dark Knight'.", answer: "Who is Batman?" },
        { value: 200, question: "This band sang 'Bohemian Rhapsody'.", answer: "Who is Queen?" },
        { value: 300, question: "This streaming service uses a red 'N' logo.", answer: "What is Netflix?" },
        { value: 400, question: "This video game plumber has a brother named Luigi.", answer: "Who is Mario?" },
        { value: 500, question: "This fantasy series features dragons and the Iron Throne.", answer: "What is Game of Thrones?" },
      ],
    },
    {
      name: "Geography",
      clues: [
        { value: 100, question: "This is the largest ocean on Earth.", answer: "What is the Pacific Ocean?" },
        { value: 200, question: "This country is home to the Great Barrier Reef.", answer: "What is Australia?" },
        { value: 300, question: "This mountain is the tallest in the world.", answer: "What is Mount Everest?" },
        { value: 400, question: "This river flows through Egypt.", answer: "What is the Nile?" },
        { value: 500, question: "This is the smallest country in the world.", answer: "What is Vatican City?" },
      ],
    },
    {
      name: "Food & Drink",
      clues: [
        { value: 100, question: "This Italian dish consists of layers of pasta, meat, and cheese.", answer: "What is Lasagna?" },
        { value: 200, question: "This beverage is made from fermented grapes.", answer: "What is Wine?" },
        { value: 300, question: "This spicy Japanese condiment is made from horseradish.", answer: "What is Wasabi?" },
        { value: 400, question: "This French pastry is known for its crescent shape.", answer: "What is a Croissant?" },
        { value: 500, question: "This Mexican dish features a fried tortilla topped with beans and cheese.", answer: "What is a Tostada?" },
      ],
    },
    {
      name: "Sports",
      clues: [
        { value: 100, question: "This sport uses a shuttlecock.", answer: "What is Badminton?" },
        { value: 200, question: "This country has won the most FIFA World Cups.", answer: "What is Brazil?" },
        { value: 300, question: "This basketball legend wore number 23 for the Chicago Bulls.", answer: "Who is Michael Jordan?" },
        { value: 400, question: "This tennis tournament is played on grass courts.", answer: "What is Wimbledon?" },
        { value: 500, question: "This Olympic event combines skiing and rifle shooting.", answer: "What is Biathlon?" },
      ],
    },
  ],
};
