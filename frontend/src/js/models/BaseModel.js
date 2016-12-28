class BaseModel {
    static reduce(state = {}, action) {
        return state;
    }

    static getInitialState() {
        return Promise.resolve({});
    }
}

export default BaseModel