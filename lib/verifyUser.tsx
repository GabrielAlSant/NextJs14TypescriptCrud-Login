export function VerifyUser(user:any, route:any){
    if(user==null){
        route.push('/Login')
    }
} 