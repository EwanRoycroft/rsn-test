import '../../styles/components/App.scss';

import React, { forwardRef, createRef, useEffect } from 'react';
import { init, useFocusable } from '@noriginmedia/norigin-spatial-navigation';

init({
    // debug: true,
    // visualDebug: true,
});

const padding = 50;
const behavior = 'smooth';

const ScrollView = forwardRef(function (props, ref) {
    return (
        <div
            className="scroll-view"
            style={{
                ...props.style,
                overflowX: props.horizontal ? 'scroll' : 'hidden',
                overflowY: props.horizontal ? 'hidden' : 'scroll',
            }}
            ref={ref}
        >
            {props.children}
        </div>
    );
});

ScrollView.displayName = 'ScrollView';

const Item = function (props) {
    const { ref, focused } = useFocusable({
        focusKey: props.focusKey,
        onFocus: props.onFocus,
    });

    return (
        <div
            ref={ref}
            style={{
                height: '100%',
                outline: focused ? '3px solid red' : '1px solid black',
            }}
        >
            {props.number}
        </div>
    );
};

const Rail = function (props) {
    const ref = createRef();

    return (
        <ScrollView
            horizontal
            style={{
                width: '100%',
                height: '200px',
                outline: '1px solid black',

                boxSizing: 'border-box',
            }}
            ref={ref}
        >
            <div
                style={{
                    width: 'fit-content',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 100px)',
                    gridTemplateRows: ' 100px',
                    gap: `${padding}px`,
                    alignItems: 'center',
                    padding: `${padding}px`,
                    paddingRight: '100%',
                }}
            >
                {props.items.map((value, itemKey) => (
                    <Item
                        key={itemKey}
                        number={itemKey + 1}
                        focusKey={`${props.focusKey}item${itemKey}`}
                        onFocus={(element) => {
                            ref.current?.scrollTo({
                                left: element.x - padding,
                                behavior,
                            });
                            props.onFocus({ node: ref.current });
                        }}
                    />
                ))}
            </div>
        </ScrollView>
    );
};

const App = function () {
    const { ref, setFocus } = useFocusable();

    useEffect(() => setFocus('rail0item0'), [setFocus]);

    return (
        <ScrollView
            ref={ref}
            style={{
                width: '100%',
                height: '100%',
                padding: `${padding}px`,
                display: 'grid',
                gap: `${padding}px`,
                boxSizing: 'border-box',
            }}
        >
            {new Array(10).fill(undefined).map((value, railKey) => (
                <Rail
                    key={railKey}
                    focusKey={`rail${railKey}`}
                    items={new Array(10).fill(undefined)}
                    onFocus={(element) => {
                        element.node.scrollIntoView({
                            behavior,
                            block: 'center',
                        });
                    }}
                />
            ))}
        </ScrollView>
    );
};

export default App;
