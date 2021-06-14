class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performances = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        let result = 0;

        switch (this.play.type) {
            case "tragedy": //비극
                result = 40000;
                if (this.performances.audience > 30 ) {
                    result += 1000 * (this.performances.audience - 30);
                }
            break;
            case "comedy": //코메디
                result = 30000;
                if (this.performances.audience > 20) {
                    result += 10000 + 500 * (this.performances.audience - 20);
                }
                result += 300 * this.performances.audience;
            break;
            default:
                throw new Error(`알수 없는 장르: ${this.play.type}`);
        }

        return result;
    }

    
    get volumeCredits() {
        let result = 0;
        result = Math.max(this.performances.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === this.play.type) {
            result += Math.floor(this.performances.audience / 5);
        }
        return result;
    }
}

export default function createStatementData(invoices, plays) {
    const statementData = {};
    statementData.customer = invoices.customer;
    statementData.performances = invoices.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);    
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
    }

    function volumeCreditsFor(aPerformance) {
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
    }

    function totalAmount(data) {
        return data.performances
               .reduce( (total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances
               .reduce( (total, p) => total + p.volumeCredits, 0);
    }
}
