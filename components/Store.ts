import {useState} from 'react';
import {createContainer} from 'react-tracked';

interface Globals {
    page: number,
    me: {
        uid: string,
        username: string,
    } | null
}

const initialState: Globals = {
    page: 2,
    me: null,
    // me: {
    //     uid: "",
    //     username: "DEBUG"
    // }
};

const useMyState = () => useState<Globals>(initialState);

export const {Provider: SharedStateProvider, useTracked: useSharedState} =
    createContainer(useMyState);
