// @ts-nocheck

interface MyPlugin{
    name: string;
    calculate(num:number):this;
}

class Calculator {

    private plugins:MyPlugin[] = [];

    private num: number;

    constructor(initial: number) {
        this.num = initial;
    }   

    use(plugin:MyPlugin) {
        this.plugins.push(plugin);
        this[plugin.name] = plugin.calculate.bind(this);
    }

    result() {
        return this.num;
    }
}

class AddPlugin implements MyPlugin{

    name = 'add';

    calculate(num) {
        this.num = this.num + num;
        return this;
    }
}

class SubtractPlugin implements MyPlugin {

    name = 'subtract';

    calculate(num) {
        this.num = this.num - num;
        return this;
    }
}

const cacl = new Calculator(5);

cacl.use(new AddPlugin());
cacl.use(new SubtractPlugin());


console.log(cacl.add(10).subtract(3).result());