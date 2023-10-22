import { Description, SubTitle } from '../../UI/Headers';
import ActiveUsers from './Users/ActiveUsers';

interface P2PSidebarDisplayProps {}

export default function P2PSidebarDisplay({}: P2PSidebarDisplayProps) {
    return (
        <aside className="flex flex-col p-2 space-y-2 lg:border-r border-zinc-500">
            <SubTitle> Users </SubTitle>
            <Description>
                The following users are logged in. Pick a user you want to call
            </Description>
            <ActiveUsers />
        </aside>
    );
}
