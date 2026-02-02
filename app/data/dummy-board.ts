import { GameBoard } from "../types";

export const dummyBoard: GameBoard = {
  categories: [
    {
      name: "Music",
      clues: [
        { value: 100, question: "This song encourages the listener to reverse their behind, which would be jarring in this George Clooney/Anna Kendrick movie containing copious layoffs (or Superman's catchphrase for taking flight).", answer: "Back That Ass Up, Up, and Away" },
        { value: 200, question: "The Beatles suggest that joy can fire projectiles, possibly from the arm of this Japanese anime featuring giant robots.", answer: "Happiness Is a Warm Gun-dam" },
        { value: 300, question: "You'll need a professor from the School of Rock for this 'Wham Bah Lam' song by Ram Jam", answer: "Jack Black Betty"},
        { value: 400, question: "These two female artists' hit songs have juxtaposed views on their partner. Belinda Carlisle implies their angellic presence, but Alanis Morissette is less kind.", answer: "Heaven Is A Place On Earth With You Oughta Know" },
        { value: 500, question: "Chase's ex-wife probably reads this famous romance author, while listening to this underrated Coldplay gem.", answer: "Nicholas Sparks" },
      ],
    },
    {
      name: "Video Games",
      clues: [
        { value: 100, question: "Beyonce's can feel your _____, _____, ____, she can feel your _____, _____, _____ in the third entry of this XBox/343 Industries FPS classic", answer: "Halo 3" },
        { value: 200, question: "His majesty of Camelot would welcome this early 1900's American video game protagonist as a knight of the round table.", answer: "King Arthur Morgan" },
        { value: 300, question: "Dating in this Japanese book club gets scarier over time, so I'd much rather prefer tipping the iceberg with my fellow flightless arctic birds", answer: "Doki Doki Literature Club Penguin" },
        { value: 400, question: "The latest Mario Party game is set in this cozy, farming sim.", answer: "Mario Party Super Stardew Valley" },
        { value: 500, question: "These plumber brothers are infamous in the Mushroom Kingdom, and you'll need both of their full names for this answer. Finally, the green one gets to go first.", answer: "Luigi Mario Mario" },
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
