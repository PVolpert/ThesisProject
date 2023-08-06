import Card from '../UI/Card';
import { Description, MainTitle } from '../UI/Headers';
import LoginList from './LoginList';

export default function LoginDisplay() {
    return (
        <Card>
            <div className="flex flex-col space-y-3 p-6 md:p-20">
                <MainTitle className="">Welcome!</MainTitle>
                <Description>
                    Log in to get access to all video calling features
                </Description>
                <LoginList />
            </div>
            <img
                src="https://cdn.pixabay.com/photo/2016/05/25/19/45/tower-1415723_640.jpg"
                className="w-[430px] hidden md:block rounded-r-2xl"
            />
        </Card>
    );
}
