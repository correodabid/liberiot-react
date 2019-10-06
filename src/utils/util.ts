import { RouteComponentProps } from "react-router";

export function getAvatarString(first_name: string, last_name: string): string {
    let result: string = first_name.slice(0, 1) + last_name.slice(0, 1)
    return result.toUpperCase();
}

export function goToException(props: RouteComponentProps) {
    props.history.replace('/exception')
}