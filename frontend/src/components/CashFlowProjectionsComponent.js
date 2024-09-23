import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
} from '@chakra-ui/react'

function CashFlowProjectionsComponent() {

    return (
        <div>
            Free Cash flow:
            <Slider aria-label='slider-ex-1' defaultValue={30}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>

            <p>Coming Soon</p>
        </div>
    );
}

export default CashFlowProjectionsComponent;