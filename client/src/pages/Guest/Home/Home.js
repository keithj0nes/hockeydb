import React, { useState } from 'react';
import TodaysGames from '../../../components/TodaysGames';
import SlideOut from '../../../components/SlideOut';
import News from './News';
import './home.scss';

const Home = () => {
    const [leftSliderVisible, setLeftSliderVisible] = useState(false);

    return (
        <>
            <div className="home-container">

                <div className="hide-desktop">
                    <SlideOut isVisible={leftSliderVisible} onClose={() => setLeftSliderVisible(!leftSliderVisible)} slideFrom="right">
                        <TodaysGames />
                    </SlideOut>
                </div>

                <News />

                <div className="hide-mobile">
                    <TodaysGames />
                </div>
            </div>

            <div
                className="todays-games-toggle-button"
                onClick={() => setLeftSliderVisible(!leftSliderVisible)}
            >
                Today&apos;s Games
            </div>

        </>
    );
};

export default Home;
