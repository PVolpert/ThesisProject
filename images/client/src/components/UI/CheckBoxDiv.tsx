import { Description, SubSubTitle } from './Headers';

interface CheckBoxDivProps {
    isChecked: boolean;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    title: string;
    desc: string;
}

export default function CheckBoxDiv({
    isChecked,
    onChangeHandler,
    name,
    title,
    desc,
}: CheckBoxDivProps) {
    return (
        <div className="grid grid-cols-[minmax(0,6rem)_1fr] py-2 hover:bg-zinc-300 dark:hover:bg-zinc-800 first:rounded-t-2xl last:rounded-b-2xl">
            <input
                type="checkbox"
                defaultChecked={isChecked}
                onChange={onChangeHandler}
                name={name}
                id={name}
                className="w-4 h-4 outline-offset-4 relative cursor-pointer accent-softblue place-self-center hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 transition duration-1050"
            />

            <label htmlFor={name} className="grid gap-y-2">
                <SubSubTitle className="">{title}</SubSubTitle>
                <Description>{desc}</Description>
            </label>
        </div>
    );
}
