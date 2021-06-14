import createStatementData from './createStatementData.js';

(function($){

    let invoices = {
        "customer" : "BigCo",
        "performances" : [
            {
                "playID" : "hamlet",
                "audience" : 55
            },
            {
                "playID" : "as-like",
                "audience" : 35
            },
            {
                "playID" : "othello",
                "audience" : 40
            }
        ]
    };
    let plays = {
        "hamlet"   : {"name": "Hamlet", "type": "tragedy"},
        "as-like"  : {"name": "As You like it", "type": "comedy"},
        "othello"  : {"name": "Othello", "type": "tragedy"}
    }

    /**
     * Let's refactoring
     * 
     * 1. switch 문 제거 ('함수 추출하기')
     * - amountFor() 함수로 기능 분리
     * 
     * 2. amountFor() 함수 변경
     * - perf -> aPerfomance
     * - play 인자 제거 
     *   - playFor() 함수 생성 ('임시 변수를 질의 함수로 바꾸기')
     *   - playFor() '변수 인라인하기'
     * - amountFor() '변수 인라인하기'
     * 
     * 3. volumeCredits(적립금) 처리 함수 추가.
     * 4. format 임시변수 제거하기
     * 5. volumeCredits 변수 제거하기
     * - '반복문 쪼개기'
     * - '문장 슬라이드' 처리 (변수 선언 문장 반복문 앞으로 선언)
     * - '임시 변수를 질의 함수로 바꾸기, 함수로 추출' (totalVolumeCredits)
     * - '변수를 인라인'
     * 6. totalAmount 변수 제거하기
     * 7. 내부 함수에 쓰이는 return 변수 명 스타일대로 고치기.
     * 8. 결과 HTML 출력 구조 구성하기
     * - 계산 단계와 포멧팅 단계 분리하기
     *    - renderPlainText() 함수로 전체 분리
     *    - renderPlainText() 에서 필요한 data 구성하기
     *        - playFor
     *        - amountFor
     *        - volumeCredits 
     *        - 각종 total 함수들
     * 9. 반복문 파이프라인 변경
     * 10. createStatementData 함수 분리
     * 11. html 출력 함수 추가 (htmlStatement, renderHtml)
     */ 

    function statement(invoices, plays) {
        return renderPlainText(createStatementData(invoices, plays));
    }

    function renderPlainText(data) {
        let result = `청구 내역 (고객명: ${data.customer})\n`;
        
        for (let perf of data.performances) {
            //청구 내역을 출력한다.
            result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
        }

        result += `총액: ${usd(data.totalAmount)}\n`;
        result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
        return result;
        
        function usd(aNumber) {
            return new Intl.NumberFormat("en-US",  { style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber/100);
        }
    }

    function htmlStatement(invoices, plays) {
        return renderHtml(createStatementData(invoices, plays));
    }

    function renderHtml(data) {
        let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
        result += "<table>\n";
        result += "<tr><th>연극</th><th>좌석 수 </th><th>금액</th></tr>";
        
        for (let perf of data.performances) {
            result += ` <tr><td>${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)</td>`;
            result += ` <td>${usd(perf.amount)}</td>\n`;
        }
        result += "</table>\n";
        return result;

        function usd(aNumber) {
            return new Intl.NumberFormat("en-US",  { style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber/100);
        }
    }

    $('body').append(htmlStatement(invoices, plays));
    
})(jQuery);
