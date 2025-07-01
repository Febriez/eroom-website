export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>

      <div className="prose prose-invert max-w-none">
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <p className="text-gray-400 text-sm">최종 업데이트: 2025년 6월 15일</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. 개요</h2>
          <p>본 개인정보 처리방침은 당사가 귀하의 개인정보를 수집, 사용, 보호하는 방법에 대해 설명합니다. 당사는 귀하의 개인정보 보호를 중요하게 생각하며, 관련 법률 및 규정을 준수하고 있습니다.</p>
          <p className="mt-3">본 서비스를 이용함으로써 귀하는 본 개인정보 처리방침에 동의하게 됩니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. 수집하는 개인정보</h2>
          <p>당사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>계정 정보</strong>: 이름, 이메일 주소, 비밀번호, 사용자명</li>
            <li><strong>프로필 정보</strong>: 프로필 사진, 자기소개, 위치</li>
            <li><strong>통신 정보</strong>: 메시지 내용, 대화 기록</li>
            <li><strong>기기 정보</strong>: IP 주소, 브라우저 유형, 운영 체제, 기기 식별자</li>
            <li><strong>사용 정보</strong>: 로그인 기록, 활동 내역, 서비스 이용 시간</li>
            <li><strong>위치 정보</strong>: GPS 데이터(사용자가 허용한 경우)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. 개인정보 수집 방법</h2>
          <p>당사는 다음과 같은 방법으로 개인정보를 수집합니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>회원가입 및 계정 생성 과정에서 직접 제공하는 정보</li>
            <li>서비스 이용 과정에서 자동으로 생성되는 정보</li>
            <li>쿠키 및 유사 기술을 통해 수집되는 정보</li>
            <li>제3자 서비스(Google, Facebook 등)를 통한 로그인 시 제공되는 정보</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. 개인정보의 이용 목적</h2>
          <p>수집된 개인정보는 다음과 같은 목적으로 이용됩니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>서비스 제공 및 운영</li>
            <li>계정 관리 및 보안</li>
            <li>고객 지원 및 문의 응대</li>
            <li>서비스 개선 및 맞춤화</li>
            <li>마케팅 및 광고 활동(동의한 경우)</li>
            <li>법적 의무 준수 및 권리 보호</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. 개인정보의 보유 및 파기</h2>
          <p>당사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 다음의 정보에 대해서는 관련 법령에 따라 일정 기간 동안 보존합니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>전자상거래 등에서의 소비자 보호에 관한 법률</strong>: 계약 또는 청약철회 등에 관한 기록(5년), 대금결제 및 재화 등의 공급에 관한 기록(5년), 소비자 불만 또는 분쟁처리에 관한 기록(3년)</li>
            <li><strong>통신비밀보호법</strong>: 로그인 기록(3개월)</li>
          </ul>
          <p className="mt-3">개인정보 파기 시에는 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구 삭제하며, 물리적 문서는 분쇄하거나 소각합니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. 개인정보의 제3자 제공</h2>
          <p>당사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외적으로 제공할 수 있습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>이용자가 명시적으로 동의한 경우</li>
            <li>법률에 의해 요구되는 경우</li>
            <li>서비스 제공에 필요한 업무를 위탁하는 경우</li>
            <li>회사의 합병, 인수, 자산 매각 등의 거래가 발생하는 경우</li>
          </ul>
          <p className="mt-3">제3자 제공 시 제공받는 자, 제공 목적, 제공하는 개인정보 항목에 대해 별도로 고지하고 동의를 받습니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. 이용자의 권리</h2>
          <p>이용자는 자신의 개인정보에 대해 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>개인정보 열람 및 복사본 요청 권리</li>
            <li>부정확한 정보의 수정 요청 권리</li>
            <li>개인정보 처리 정지 요청 권리</li>
            <li>개인정보 삭제 요청 권리(&quot;잊혀질 권리&quot;)</li>
            <li>개인정보 이동 요청 권리</li>
            <li>동의 철회 권리</li>
          </ul>
          <p className="mt-3">이러한 권리를 행사하려면 당사의 개인정보 보호책임자에게 서면, 전화 또는 이메일로 연락하시기 바랍니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. 개인정보의 안전성 확보 조치</h2>
          <p>당사는 이용자의 개인정보를 보호하기 위해 다음과 같은 안전성 확보 조치를 취하고 있습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>개인정보의 암호화: 비밀번호, 중요 개인정보는 암호화하여 저장 및 관리</li>
            <li>해킹 등에 대비한 기술적 대책: 방화벽, 침입 탐지 시스템 등 보안 시스템 구축</li>
            <li>접근 제한: 개인정보를 처리하는 직원 최소화 및 교육 실시</li>
            <li>정기적인 보안 점검 및 취약점 분석</li>
            <li>물리적 보안 강화: 전산실, 자료 보관실 등의 접근 통제</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. 쿠키 및 유사 기술</h2>
          <p>당사는 쿠키 및 유사 기술을 사용하여 이용자의 서비스 이용 경험을 향상시키고 맞춤화된 서비스를 제공합니다. 쿠키 사용에 대한 자세한 내용은 당사의 <a href="/cookies" className="text-green-400 hover:underline">쿠키 정책</a>을 참조하시기 바랍니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. 개인정보 보호책임자</h2>
          <p>당사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
          <div className="mt-3">
            <p><strong>개인정보 보호책임자</strong></p>
            <p>이름: 홍길동</p>
            <p>직위: 개인정보보호팀장</p>
            <p>연락처: privacy@example.com, 02-123-4567</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">11. 개인정보 처리방침 변경</h2>
          <p>본 개인정보 처리방침은 법률 또는 서비스의 변경사항을 반영하기 위해 수시로 업데이트될 수 있습니다. 처리방침이 변경되는 경우, 변경 사항을 서비스 내 공지 또는 이메일을 통해 알려드립니다.</p>
          <p className="mt-3">변경된 개인정보 처리방침은 웹사이트에 게시된 시점부터 효력이 발생합니다.</p>
        </section>
      </div>
    </div>
  );
}
