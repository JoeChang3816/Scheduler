import { Affix, Button, rem, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import classes from '../CSS/button.module.css';

export default function Scroll (){

    const [scroll, scrollTo] = useWindowScroll();

    return(
    
        <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => (
                <Button
                    className={classes.MenuButtons}
                    leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
                    style={transitionStyles}
                    onClick={() => scrollTo({ y: 0 })}
                >
                    Scroll to top
                </Button>
                )}
            </Transition>
        </Affix>
    )

}


