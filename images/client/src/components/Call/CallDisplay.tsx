import Conference from './Conference/Conference';
import Sidebar from './Sidebar/Sidebar';
import Page from '../UI/Page';

export function CallDisplay() {
    return (
        <Page className="lg:grid lg:grid-cols-[minmax(100px,_25%)_1fr] gap-4">
            <Sidebar />
            <div className="flex flex-col">
                {/* <ICTAuthList /> */}
                <Conference />
            </div>
        </Page>
    );
}
