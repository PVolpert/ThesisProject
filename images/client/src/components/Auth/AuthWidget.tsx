import Card from "../UI/Card"
import AuthList from "./AuthList"
import classes from './AuthWidget.module.css'


export default function AuthWidget (){
    return <Card className={classes.auth}>
        <header className={classes['auth__description']}>
            <h3>Welcome!</h3>
            <p>Log in to continue.</p></header>
        < AuthList/>
    </Card>
}