export const isValidMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/g;

    return mobileRegex.test(mobile)
}

export const getPendingTime = (timestamp: number) => {
    const currTime = Date.now();
    let difference = timestamp - currTime;

    const minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    const secondsDifference = Math.floor(difference/1000);

    return {
        minutesDifference,
        secondsDifference
    }
}
