import '/src/styles/components/App.scss';

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import {
    initNavigation,
    withFocusable,
} from '@noriginmedia/react-spatial-navigation';

initNavigation({
    debug: true,
    visualDebug: true,
});

const FocusableDiv = withFocusable()((props) => {
    useEffect(() => console.log(`${props.focusKey} mounted`));

    return (
        <div className={`focusable ${props.focused ? 'focus' : ''}`}>
            {props.children}
        </div>
    );
});

const Page1 = withFocusable({ trackChildren: true })((props) => {
    const history = useHistory();

    useEffect(() => console.log('Page1 mounted'));

    useEffect(() => props.setFocus('focusableA0'));

    return (
        <div
            className={`container ${
                props.hasFocusedChild ? 'hasFocusedChild' : ''
            } ${props.focused ? 'focus' : ''}`}
        >
            <FocusableDiv focusKey="focusableA0" onEnterPress={props.openPopup}>
                Press enter to open pop up
            </FocusableDiv>
            <FocusableDiv
                focusKey="focusableA1"
                onEnterPress={() => history.push('/page2')}
            >
                Go to page 2
            </FocusableDiv>
        </div>
    );
});

const Page2 = withFocusable({ trackChildren: true })((props) => {
    const history = useHistory();

    useEffect(() => console.log('Page2 mounted'));

    useEffect(() => props.setFocus('focusableB0'));

    return (
        <div
            className={`container ${
                props.hasFocusedChild ? 'hasFocusedChild' : ''
            } ${props.focused ? 'focus' : ''}`}
        >
            <FocusableDiv focusKey="focusableB0" onEnterPress={props.openPopup}>
                Press enter to open pop up
            </FocusableDiv>
            <FocusableDiv
                focusKey="focusableB1"
                onEnterPress={() => history.goBack()}
            >
                Go to page 1
            </FocusableDiv>
        </div>
    );
});

const Popup = withFocusable({ trackChildren: true, blockNavigationOut: true })(
    (props) => {
        useEffect(() => console.log('Popup mounted'));

        useEffect(() => props.setFocus('popupFocusable0'));

        return (
            <div
                className={`container popup ${props.className || ''} ${
                    props.hasFocusedChild ? 'hasFocusedChild' : ''
                } ${props.focused ? 'focus' : ''}`}
            >
                <FocusableDiv
                    onEnterPress={() => props.setPopupVisible(false)}
                    focusKey="popupFocusable0"
                >
                    Press enter to close
                </FocusableDiv>
                <FocusableDiv
                    onEnterPress={() => props.setPopupVisible(false)}
                    focusKey="popupFocusable1"
                />
            </div>
        );
    }
);

const App = () => {
    const [popupVisible, setPopupVisible] = useState(false);

    useEffect(() => console.log('App mounted'));

    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Page1
                            focusKey="containerA"
                            openPopup={() => setPopupVisible(true)}
                        />
                    </Route>
                    <Route path="/page2">
                        <Page2
                            focusKey="containerB"
                            openPopup={() => setPopupVisible(true)}
                        />
                    </Route>
                </Switch>
            </Router>
            {popupVisible ? (
                <Popup
                    focusKey="popupContainer"
                    setPopupVisible={setPopupVisible}
                />
            ) : null}
        </>
    );
};

export default withFocusable()(App);
