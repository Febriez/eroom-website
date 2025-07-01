export default function TermsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>

      <div className="prose prose-invert max-w-none">
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <p className="text-gray-400 text-sm">최종 업데이트: 2025년 6월 15일</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. 서비스 소개</h2>
          <p>본 이용약관("약관")은 당사가 제공하는 서비스 이용에 관한 조건과 규정을 설명합니다. 본 약관에서 "당사"는 서비스 제공자를, "사용자" 또는 "귀하"는 당사 서비스를 이용하는 모든 개인을 의미합니다.</p>
          <p className="mt-3">본 서비스를 이용함으로써 귀하는 본 약관에 동의하게 됩니다. 본 약관에 동의하지 않는 경우 당사 서비스를 이용하실 수 없습니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. 서비스 이용</h2>
          <p>당사는 귀하에게 다음과 같은 조건하에 서비스를 이용할 수 있는 권리를 부여합니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>귀하는 13세 이상이어야 합니다.</li>
            <li>서비스 이용 시 정확한 정보를 제공해야 합니다.</li>
            <li>계정 보안에 대한 책임은 귀하에게 있습니다.</li>
            <li>당사의 서비스를 불법적인 목적으로 사용해서는 안 됩니다.</li>
            <li>서비스 이용 중 발생하는 모든 활동에 대한 책임은 귀하에게 있습니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. 계정 관리</h2>
          <p>당사 서비스를 이용하기 위해서는 계정을 생성해야 할 수 있습니다. 계정 생성 시 다음 사항에 동의합니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>정확하고 완전한 정보를 제공합니다.</li>
            <li>비밀번호를 안전하게 보관하고 정기적으로 변경합니다.</li>
            <li>계정의 무단 접근이나 사용이 의심될 경우 즉시 당사에 알립니다.</li>
            <li>당사는 귀하의 계정 활동에 대해 책임을 지지 않습니다.</li>
          </ul>
          <p className="mt-3">당사는 다음과 같은 경우 귀하의 계정을 일시 중지하거나 해지할 권리를 보유합니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>본 약관을 위반한 경우</li>
            <li>불법적이거나 사기적인 활동이 의심되는 경우</li>
            <li>다른 사용자의 안전이나 경험을 위협하는 행동을 하는 경우</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. 사용자 콘텐츠</h2>
          <p>귀하가 당사 서비스에 업로드하거나 공유하는 모든 콘텐츠("사용자 콘텐츠")에 대해 다음 사항에 동의합니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>귀하는 사용자 콘텐츠에 대한 모든 권리와 라이선스를 보유하거나 필요한 권한을 획득했음을 보증합니다.</li>
            <li>당사에 사용자 콘텐츠를 전 세계적으로 사용, 복제, 수정, 배포할 수 있는 비독점적, 로열티 없는, 양도 가능한 라이선스를 부여합니다.</li>
            <li>귀하의 사용자 콘텐츠는 타인의 권리를 침해하거나 불법적인 내용을 포함해서는 안 됩니다.</li>
            <li>당사는 부적절하거나 불법적인 사용자 콘텐츠를 삭제하거나 접근을 제한할 권리를 보유합니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. 지적재산권</h2>
          <p>당사의 서비스, 소프트웨어, 상표, 로고 및 콘텐츠에 대한 모든 지적재산권은 당사 또는 라이선스 제공자의 소유입니다. 본 약관은 귀하에게 이러한 지적재산권을 양도하지 않습니다.</p>
          <p className="mt-3">귀하는 다음과 같은 행위를 해서는 안 됩니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>당사의 명시적 허가 없이 당사의 지적재산을 사용, 복제, 수정 또는 배포하는 행위</li>
            <li>서비스를 디컴파일, 리버스 엔지니어링 또는 소스 코드를 추출하려는 시도</li>
            <li>당사의 서비스에서 저작권, 상표 또는 기타 소유권 표시를 제거하는 행위</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. 면책 조항</h2>
          <p>당사 서비스는 "있는 그대로" 및 "이용 가능한 대로" 제공됩니다. 당사는 다음 사항에 대해 명시적 또는 묵시적 보증을 하지 않습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>서비스의 정확성, 완전성, 신뢰성 또는 가용성</li>
            <li>서비스가 귀하의 요구사항을 충족하거나 중단 없이 안전하게 운영될 것이라는 보장</li>
            <li>서비스를 통해 얻은 결과의 정확성이나 신뢰성</li>
            <li>서비스의 오류나 결함이 수정될 것이라는 보장</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. 책임 제한</h2>
          <p>법률이 허용하는 최대 범위 내에서, 당사는 다음과 같은 손해에 대해 책임을 지지 않습니다:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>간접적, 부수적, 특별, 결과적 또는 징벌적 손해</li>
            <li>이익, 수익, 데이터, 사용 또는 기타 무형 손실</li>
            <li>서비스 사용 또는 사용 불능으로 인한 손해</li>
            <li>서비스를 통해 획득한 정보나 콘텐츠로 인한 손해</li>
          </ul>
          <p className="mt-3">이러한 제한은 당사가 그러한 손해의 가능성을 알고 있었더라도 적용됩니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. 분쟁 해결</h2>
          <p>본 약관과 관련된 모든 분쟁은 대한민국 법률에 따라 해석되며, 서울중앙지방법원을 전속 관할로 합니다.</p>
          <p className="mt-3">소송을 제기하기 전에 당사에 먼저 연락하여 분쟁을 비공식적으로 해결하도록 노력해 주시기 바랍니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. 약관 변경</h2>
          <p>당사는 언제든지 본 약관을 수정할 권리를 보유합니다. 중요한 변경사항이 있을 경우, 당사는 서비스 내 공지 또는 이메일을 통해 알려드립니다.</p>
          <p className="mt-3">변경된 약관이 게시된 후에도 계속 서비스를 이용하는 경우, 귀하는 수정된 약관에 동의한 것으로 간주됩니다.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. 연락처</h2>
          <p>본 약관에 관한 질문이나 의견이 있으시면 다음 연락처로 문의해 주십시오:</p>
          <p className="mt-3">이메일: legal@example.com</p>
          <p>주소: 서울특별시 강남구 테헤란로 123, 456빌딩 7층</p>
          <p>전화번호: 02-123-4567</p>
        </section>
      </div>
    </div>
  );
}
