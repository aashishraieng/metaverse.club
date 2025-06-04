import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './EventPage.css';
import Badminton from '../../assets/badminton.jpg';
import Boxing from '../../assets/boxing.webp';
import Poetry from '../../assets/poetry.jpg';
import Photography from '../../assets/photography.webp';
import Football from '../../assets/football.jpeg';
import Cricket from '../../assets/cricket.jpg';
import Gust from '../../assets/gustlecture.webp';
import Standup from '../../assets/standup.jpg';
import Swimming from '../../assets/swimming.jpg';
import Trip from '../../assets/Trip.jpg';
import Webinar from '../../assets/webinar.avif';


const eventData = [
  {
  title: 'Poetry',
  description: 'A creative expression of emotions and thoughts through rhythmic and aesthetic language.',
  image: Poetry,
},
{
  title: 'Boxing',
  description: 'An intense sport emphasizing strength, strategy, and endurance in physical combat.',
  image: Boxing,
},
{
  title: 'Football',
  description: 'A dynamic team sport focused on skill, teamwork, and competitive spirit on the field.',
  image: Football,
},
{
  title: 'Photography',
  description: 'The art of capturing moments and stories through the lens of a camera.',
  image: Photography,
},
{
  title: 'Badminton',
  description: 'A fast-paced racquet sport requiring agility, precision, and quick reflexes.',
  image: Badminton,
},
{
  title: 'Webinar',
  description: 'An interactive online seminar designed for sharing knowledge and engaging audiences remotely.',
  image: Webinar,
},
{
  title: 'Trip',
  description: 'An adventurous journey to explore new places, cultures, and experiences.',
  image: Trip,
},
{
  title: 'Swimming',
  description: 'A full-body exercise and sport that promotes health, stamina, and relaxation in water.',
  image: Swimming,
},
{
  title: 'Standup',
  description: 'A form of comedy where performers entertain audiences through humorous monologues and storytelling.',
  image: Standup,
},
{
  title: 'Gust Lecture',
  description: 'An educational talk delivered by a guest expert to provide insights and inspire learning.',
  image: Gust,
},
{
  title: 'Cricket',
  description: 'A strategic team sport known for its rich tradition, skillful play, and spirited competition.',
  image: Cricket,
},



];

export default function WuxingCarousel() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % eventData.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentEvent = eventData[index];

  return (
    <div className="carousel-wrapper">
      <div className="left-text">
        <h1>{currentEvent.title}</h1>
        <p>{currentEvent.description}</p>
      </div>

      <div className="right-carousel">
        <div className="stacked-carousel">
          {eventData.map((item, i) => {
            // Calculate offset from active index (wrap around)
            const offset = (i - index + eventData.length) % eventData.length;

            // We only show first 3 cards stacked for performance & style
            if (offset > 3) return null;

            // Calculate style props for 3D stacking effect:
            // The closer to 0 offset (active), the more front & bigger
            // Farther ones get smaller, shifted, and back on z-axis
            const zIndex = 10 - offset;
            const scale = 1 - 0.1 * offset;
            const xOffset = 60 * offset;  // shift more sideways so cards peek from the right
const yOffset = 10 * offset;  // slight downward shift
const zOffset = -80 * offset; // further back in 3D


            return (
              <motion.div
                key={item.title}
                className="stacked-image-wrapper"
                style={{ zIndex }}
                initial={{ opacity: 0, scale: 0.8, x: 100, y: 50, z: 0 }}
                animate={{
                  opacity: 1,
                  scale,
                  x: xOffset,
                  y: yOffset,
                  z: zOffset,
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <img src={item.image} alt={item.title} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
