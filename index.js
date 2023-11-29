const circuitBreaker = (fn, failureCount, timeThreshold) => {
    let failure = 0;
    let timeSinceLastFailure = 0;
    let isClosed = false;

    return function(...args) {
        if(isClosed) {
            const diff = Date.now() - timeSinceLastFailure;
            if(diff > timeThreshold) {
                isClosed = true;
            } else {
                console.log('Service Unavailable');
                return;
            }
        }
        try {
            const result = fn(...args);
            failure = 0;
            return result;
        } catch(error) {
            failure ++;
            timeSinceLastFailure = Date.now();
            if(failure >= failureCount) {
                isClosed = true;
            } 
            console.log('Error')
        }
    }
}

const testFunction = () => {
    let count = 0;
    return function() {
        count++;
        if(count < 4) {
            throw 'failed';
        } else {
            return 'Hello';
        }
    }
}

const t = testFunction();
const c = circuitBreaker(t, 3, 200);

c();
c();
c();
c();
setTimeout(() => {
    console.log(c());
},300)