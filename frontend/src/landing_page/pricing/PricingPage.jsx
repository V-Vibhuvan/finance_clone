import React from 'react';
import Brokerage from "./Brokerage";
import Hero from "./Hero";
import OpenAccount from '../components/OpenAccount';

export default function PricingPage() {
    return (
        <>
            <Hero />
            <OpenAccount />
            <Brokerage />
        </>
    );
}