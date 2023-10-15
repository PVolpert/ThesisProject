import Button from '../UI/Button';
import { Description } from '../UI/Headers';
import Page from '../UI/Page';

interface ConferenceDisplayProps {}

export default function ConferenceDisplay({}: ConferenceDisplayProps) {
    return (
        <Page>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <video poster="/grace_hopper.jpg"></video>
                    <Description>Grace Hopper (ICT-Alpha)</Description>
                </div>
                <div>
                    <video poster="/john_von_neumann.png"></video>
                    <Description>John von Neumann (ICT-Beta)</Description>
                </div>
            </div>
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 flex space-x-2 mb-3">
                <Button className="justify-center flex  bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050">
                    Hang Up
                </Button>
                <Button className="justify-center flex   bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050">
                    Renegotiate
                </Button>
                <Button className="justify-center flex  bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050">
                    {' '}
                    Add User
                </Button>
            </div>

            <div className="absolute right-0 bottom-0 m-3">
                <video width={300} poster="/alan-turing.jpg"></video>
                <Description>Yourself (Alan Turing (ICT-Gamma))</Description>
            </div>
        </Page>
    );
}
