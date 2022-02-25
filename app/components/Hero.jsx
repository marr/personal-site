import { useEffect, useRef } from 'react';
import Two from 'two.js';
import hero from '../assets/hero.svg';

export default function () {
    const heroRef = useRef(null);
    const setup = () => {
        if (!heroRef.current) {
            return;
        }
        const two = new Two({
            type: Two.Types.svg,
            fitted: true
        }).appendTo(heroRef.current);
        
        const crush = two.load(hero, svg => {
            svg.center();
            svg.subdivide();
            svg.fill = 'rgb(253, 109, 109)';
        });

        two.add(crush);

        two.bind('resize', resize);
        resize();

        window.addEventListener('pointermove', pointermove, false);

        two.play();

        function resize() {
            two.scene.position.set(two.width / 2, two.height / 2);
        }
    
        function pointermove (e) {
            const xpct = e.clientX / two.width;
            crush.ending = xpct * 1.2;
        }
    } 

    useEffect(setup, []);

    return <div ref={heroRef} id="hero" />;
}