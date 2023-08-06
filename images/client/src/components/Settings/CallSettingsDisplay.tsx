import CheckBoxDiv from '../UI/CheckBoxDiv';
import { Description, SubTitle } from '../UI/Headers';

interface CallSettingsDisplayProps {
    checkBoxState: {
        isAudioChecked: boolean;
        isVideoChecked: boolean;
        changeAudioCheckBoxHandler: (
            e: React.ChangeEvent<HTMLInputElement>
        ) => void;
        changeVideoCheckBoxHandler: (
            e: React.ChangeEvent<HTMLInputElement>
        ) => void;
    };
}

export default function CallSettingDisplay({
    checkBoxState: {
        isAudioChecked,
        changeAudioCheckBoxHandler,
        isVideoChecked,
        changeVideoCheckBoxHandler,
    },
}: CallSettingsDisplayProps) {
    return (
        <section className="grid gap-4">
            <header className="grid gap-1">
                <SubTitle>Call</SubTitle>
                <Description>Enable/Disable input on a call start</Description>
            </header>
            <fieldset className="grid gap-1 bg-zinc-200 dark:bg-zinc-600 border border-zinc-500 rounded-2xl">
                <CheckBoxDiv
                    isChecked={isVideoChecked}
                    onChangeHandler={changeVideoCheckBoxHandler}
                    name="Video?"
                    title="Camera"
                    desc="Activate your camera on call start"
                />
                <CheckBoxDiv
                    isChecked={isAudioChecked}
                    onChangeHandler={changeAudioCheckBoxHandler}
                    name="Microhone?"
                    title="Micro"
                    desc="Activate your microphone on call start"
                />
            </fieldset>
        </section>
    );
}
