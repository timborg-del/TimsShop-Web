import React, { useState, useEffect } from 'react';
import './CommentsComponent.css';

interface Comment {
  text: string;
  stars: number;
}

const comments: Comment[] = [
  { text: 'This one might be my favorite of the Tomte series…but they are all so heartwarming! Beautiful artwork.', stars: 5 },
  { text: 'Sooo cute! I love Joanne’s work. These prints put a smile on my face every time I look at them!', stars: 5 },
  { text: 'I just love these prints! I bought all four. They simply warm my heart!', stars: 5 },
  { text: 'Gorgeous & great quality - would absolutely recommend to anyone!', stars: 5 },
  { text: 'love my print, thank you Jo!', stars: 5 },
  { text: 'Beautiful art! It arrived in perfect condition.', stars: 5 },
  { text: 'Beautiful work as always! Love it! ', stars: 5 },
  { text: 'Such a cozy print and arrived on time and in great condition! Also really appreciated the sweet personalized thank you card Jo included ☺️ ', stars: 5 },
  { text: 'I absolutely love Jo’s artwork! The fact that I watch her create the peices on her YouTube channel and tell the story behind it gives it the personal, meaningful aspect I want in any artwork I hang on my walls. I love the Tomte series in particular…just happy, peaceful paintings! I will be buying more.', stars: 5 },
  { text: 'Beautiful vibrant colors, shipped promptly, great communication', stars: 5 },
  { text: 'Jo packed our beautiful print with love. My daughter was so excited to receive this for her birthday. It`s beautiful.', stars: 5 },
  { text: 'A beautiful piece, I love it so much and look forward to adding more of Jo`s art to my place in the future.', stars: 5 },
  { text: 'I absolutely love it!! JoAnne`s take on the mysterious Skogsrå, the mythical lady of the Swedish forest, is fascinating and unique! Nordic myth and folklore are powerful inspirations, and Jo`s choice of technique, building layers of ink to create the forest and its magical dweller, is impressive! It is amazing how she creates light, darkness and depth, striking contrasts and nuanced shades, with just one colour! The quality of the print is also wonderful, and it looks stunning on a wooden frame. And Jo`s packaging, always thoughtful and careful with Nature, is an added bonus! Totally recommended!! 😃👍', stars: 5 },
  { text: 'I love this print so much!! JoAnne`s art is truly inspiring, and this illustration conveys the idea of Nature going to sleep in Winter so beautifully, that just looking at these bears, watched by a robin in their warm and cosy hibernation, makes you feel happily in tune with the season! I love how Jo gives each character a unique personality and tells a story through their interactions. The detail and quality of the print are impressive, not to mention the lovely and thoughtful environmentally friendly packaging. Absolutely recommended!! 😃👍', stars: 5 },
  { text: 'The prints are absolutely fantastic, definitely recommend.', stars: 5 },
  { text: 'I absolutely love this illustration and the print is beautiful. Happy to have it on my wall!', stars: 5 },
  { text: 'Item was received quickly and looks great on my wall', stars: 5 },
  { text: 'Here`s another favourite of mine, inspired by mythology and folklore: the legend of the Selkie, from Jo’s point of view! I love how this painting works in two levels: if you look at it from afar, it is almost like an abstract image, but when you look closely, you find a charming, detailed, whimsical scene, where each of the playful seals surrounding the magical Selkie has a different personality. The beauty and originality of JoAnne`s artwork speaks for itself, and the quality of the print and paper is great! Her love for Nature is also visible in her thoughtful and environmentally friendly packaging. I absolutely recommend this shop!! 😃👍', stars: 5 },
  { text: 'I absolutely love this print!! This is my first purchase from Jo, and I couldn`t be happier! It is a perfect example of her artwork, inspired by Nature and myth, vibrant and meaningful, inviting you to discover little woodland treasures and magical creatures hidden in plain sight, in a world where even the ancient rocks have their own whimsical personalities. I`m also impressed with the quality of the print and the paper, which is wonderful! Besides, Jo is an environmentally friendly artist, so you can rest assured your prints will be packed with love and care not only for you, but also for the planet. Needless to say, I totally recommend her shop!! 😃👍', stars: 5 },
  
  
];

const getRandomComments = (): Comment[] => {
  const indices = new Set<number>();
  while (indices.size < 2) {
    indices.add(Math.floor(Math.random() * comments.length));
  }
  return Array.from(indices).map(index => comments[index]);
};

const CommentsComponent: React.FC = () => {
  const [currentComments, setCurrentComments] = useState<Comment[]>(getRandomComments());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentComments(getRandomComments());
    }, 12000); // 6 seconds for transition, 6 seconds for display
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="comments-container">
      {currentComments.map((comment, index) => (
        <div key={index} className={`comment comment-${index + 1}`}>
          <p>{comment.text}</p>
          <div className="stars">
            {'★'.repeat(comment.stars)}
            {'☆'.repeat(5 - comment.stars)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsComponent;



