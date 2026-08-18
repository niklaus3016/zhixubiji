import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, AlertTriangle } from 'lucide-react';

// --- Content Components ---

export const PrivacyPolicyContent: React.FC = () => (
  <div className="max-w-none text-slate-200 leading-relaxed">
    <h1 className="text-2xl font-bold text-indigo-400 text-center mb-2">🔒 隐私政策</h1>
    <p className="text-center text-slate-400 mb-6"><strong>生效日期</strong>：2026年08月18日</p>

    <div className="bg-indigo-950/50 border-l-4 border-indigo-500 p-5 rounded-lg mb-6">
      <p className="text-slate-300">欢迎使用「知序笔记」（以下简称"本应用"）。本应用由<strong>光年跃迁（温州）科技有限公司</strong>（以下简称"我们"）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。</p>
    </div>

    <p className="mb-6 text-slate-300">本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">一、我们收集的信息</h2>
    <p className="mb-4 text-slate-300">在您使用本应用的过程中，我们会收集以下信息，以提供、维护和改进我们的服务：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300"><strong>读书笔记数据</strong>：您在使用本应用过程中主动录入的所有<strong>书籍信息、摘录原文、个人感悟、标签及相关笔记数据</strong>。这些数据是本应用的核心功能内容，用于为您提供书籍管理、笔记记录、标签汇总和数据统计服务。</li>
      <li className="text-slate-300"><strong>设备信息</strong>：为了保障应用的稳定运行和优化用户体验，我们可能会自动收集您的设备相关信息，包括但不限于<strong>设备型号、操作系统版本</strong>等。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">二、我们如何使用收集的信息</h2>
    <p className="mb-4 text-slate-300">我们仅会在以下合法、正当、必要的范围内使用您的个人信息：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300"><strong>提供和改进服务</strong>：使用您的笔记数据来实现书籍管理、笔记记录、标签汇总等核心功能；通过分析设备信息和使用数据，优化应用性能，修复已知问题，提升用户体验。</li>
      <li className="text-slate-300"><strong>数据分析和统计</strong>：在对您的个人信息进行匿名化或去标识化处理后，进行内部数据分析和统计，以了解用户群体的使用习惯和需求，从而更好地规划和改进产品功能。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">三、我们如何共享、转让和公开披露信息</h2>
    <p className="mb-4 text-slate-300">我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300"><strong>法定情形</strong>：根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。</li>
      <li className="text-slate-300"><strong>获得明确同意</strong>：在获得您的明确书面同意后，我们才会向第三方共享您的个人信息。</li>
      <li className="text-slate-300"><strong>业务必要且合规</strong>：为了实现本政策第二条所述的目的，我们可能会与提供技术支持、必要服务的合作伙伴共享必要的信息，但我们会要求其严格遵守本政策及相关法律法规，并对您的信息承担保密义务。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">四、我们如何存储和保护信息</h2>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300"><strong>存储地点和期限</strong>：您的个人信息将存储于您当前设备的本地数据库中。我们会在实现本政策所述目的所必需的最短时间内保留您的信息，超出此期限后，我们将对您的信息进行删除或匿名化处理。</li>
      <li className="text-slate-300"><strong>安全措施</strong>：我们采用符合行业标准的技术手段和安全管理措施来保护您的个人信息，包括但不限于数据加密、访问控制、安全审计等，以防止信息泄露、丢失、篡改或被未经授权的访问。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">五、您的权利</h2>
    <p className="mb-4 text-slate-300">根据相关法律法规，您对您的个人信息享有以下权利：</p>
    <ol className="list-decimal pl-6 mb-6 space-y-3">
      <li className="text-slate-300"><strong>访问权</strong>：您可以随时在本应用中查看和管理您的书籍、笔记及标签数据。</li>
      <li className="text-slate-300"><strong>更正权</strong>：如您发现您的笔记数据存在错误，您可以在应用内进行修改和更正。</li>
      <li className="text-slate-300"><strong>删除权</strong>：您可以随时删除单条笔记或整个书籍的记录，应用将立即删除相关数据。</li>
      <li className="text-slate-300"><strong>数据导出</strong>：本应用支持将所有数据导出为本地文件，您可以通过此方式备份或迁移您的数据。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">六、未成年人保护</h2>
    <p className="mb-6 text-slate-300">我们非常重视对未成年人个人信息的保护。如您是未满14周岁的未成年人，在使用本应用前，应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，将立即删除相关数据。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">七、本政策的更新</h2>
    <p className="mb-6 text-slate-300">我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。如您继续使用本应用，即表示您同意接受修订后的政策。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2 text-white">八、联系我们</h2>
    <p className="mb-4 text-slate-300">如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：</p>
    <div className="bg-white/5 border border-white/10 p-4 rounded-lg mb-6">
      <p className="mb-2 text-slate-300"><strong>电子邮箱</strong>：Jp112022@163.com</p>
    </div>

    <div className="mt-8 pt-6 border-t border-white/10 text-center">
      <p className="mb-2 text-slate-400">感谢您使用知序笔记！</p>
      <p className="mb-4 text-slate-400">我们致力于为您提供安全、便捷的读书笔记服务。</p>
      <p className="text-sm text-slate-500">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

export const UserAgreementContent: React.FC = () => (
  <div className="max-w-none text-slate-200 leading-relaxed">
    <h1 className="text-2xl font-bold text-indigo-400 text-center mb-4">用户服务协议</h1>
    <p className="text-center text-slate-400 mb-8">更新日期：2026年08月18日</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-white">1. 协议的接受</h2>
    <p className="mb-3">欢迎使用「知序笔记」应用（以下简称「本应用」）。</p>
    <p className="mb-3">本协议是您与光年跃迁（温州）科技有限公司（以下简称「我们」）之间关于使用本应用的法律协议。</p>
    <p className="mb-3">通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-white">2. 服务内容</h2>
    <p className="mb-3">本应用提供以下服务：</p>
    <ul className="list-disc pl-6 space-y-2 mb-3">
      <li>创建和管理个人书籍库</li>
      <li>记录和整理读书摘录、心得及感悟</li>
      <li>通过标签系统跨书籍汇总和检索笔记</li>
      <li>查看阅读数据统计和笔记类型偏好</li>
      <li>本地数据备份、恢复与导出</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-white">3. 用户义务</h2>
    <p className="mb-3">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2 mb-3">
      <li>遵守本协议的所有条款</li>
      <li>不使用本应用进行任何非法活动</li>
      <li>不干扰本应用的正常运行</li>
      <li>保护您的设备安全，防止未授权访问</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-white">4. 知识产权</h2>
    <p className="mb-3">本应用的所有内容，包括但不限于文字、图像、音频、视频、软件等，均受知识产权法律保护。</p>
    <p className="mb-3">未经我们的书面许可，您不得复制、修改、分发或商业使用本应用的任何内容。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-white">5. 免责声明</h2>
    <p className="mb-3">本应用按「原样」提供，不做任何形式的保证。</p>
    <p className="mb-3">我们不保证：</p>
    <ul className="list-disc pl-6 space-y-2 mb-3">
      <li>本应用将符合您的要求</li>
      <li>本应用将无中断、及时、安全或无错误地运行</li>
      <li>本应用的使用结果将是准确或可靠的</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-white">6. 终止</h2>
    <p className="mb-3">我们有权在任何时候，出于任何原因，终止或暂停您对本应用的访问。</p>
    <p className="mb-3">您也可以随时停止使用本应用。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-white">7. 适用法律</h2>
    <p className="mb-3">本协议受中华人民共和国法律管辖。</p>
    <p className="mb-3">任何与本协议相关的争议，应通过友好协商解决；协商不成的，应提交至温州市有管辖权的人民法院诉讼解决。</p>
  </div>
);

// --- Modals ---

interface AgreementModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AgreementModal: React.FC<AgreementModalProps> = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-slate-900/95 text-slate-100 rounded-2xl w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-white/15 flex flex-col backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-white font-serif">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-transform hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-900/80 p-6">
        {children}
      </div>
    </motion.div>
  </div>
);

// --- Main Consent Component ---

interface PrivacyConsentProps {
  onAccept: () => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onAccept }) => {
  const [showAgreementModal, setShowAgreementModal] = useState<'agreement' | 'privacy' | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const handleOpenAgreement = () => setShowAgreementModal('agreement');
  const handleOpenPrivacy = () => setShowAgreementModal('privacy');

  const handleDeclineClick = () => setShowDeclineModal(true);
  const handleDeclineCancel = () => setShowDeclineModal(false);
  const handleDeclineConfirm = () => {
    setShowDeclineModal(false);
    // User definitely declined - show a blocked state
    alert('您已拒绝协议和隐私政策，无法使用知序笔记服务。请您阅读并同意相关协议后再继续使用。');
  };

  return (
    <>
      {/* Main Privacy Modal */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 flex-col">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/95 text-slate-100 backdrop-blur-2xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-white/15 flex flex-col"
        >
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6 text-center pt-2 font-serif">
              用户协议与隐私政策
            </h3>
            <div className="mb-5 bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl">
              <p className="text-sm text-slate-200 mb-2 font-medium">(1)《隐私政策》中关于个人信息的收集、使用和保护的说明。</p>
              <p className="text-sm text-slate-200">(2)《用户服务协议》中关于服务条款和用户义务的说明。</p>
            </div>
            <div className="mb-2">
              <p className="text-xs text-slate-400 mb-2 font-semibold">用户协议和隐私政策说明：</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                阅读完整的
                <span 
                  onClick={handleOpenAgreement} 
                  className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer font-semibold mx-1"
                >
                  《用户服务协议》
                </span>
                和
                <span 
                  onClick={handleOpenPrivacy} 
                  className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer font-semibold mx-1"
                >
                  《隐私政策》
                </span>
                了解详细内容。
              </p>
            </div>
          </div>
          <div className="flex border-t border-white/10 shrink-0">
            <button
              onClick={handleDeclineClick}
              className="flex-1 py-4 text-sm font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border-r border-white/10 transition-colors"
            >
              不同意
            </button>
            <button
              onClick={onAccept}
              className="flex-1 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              同意并继续
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decline Confirmation Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-110 flex-col">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-white/15 flex flex-col text-slate-100"
          >
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white font-serif">确认拒绝</h2>
              </div>
              <p className="text-slate-300 mb-6 text-sm leading-relaxed">您确定要拒绝隐私政策吗？拒绝后将无法使用知序笔记的核心服务。</p>
            </div>
            <div className="flex border-t border-white/10 shrink-0">
              <button
                onClick={handleDeclineCancel}
                className="flex-1 py-4 text-sm text-slate-300 font-medium hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <div className="w-px bg-white/10"></div>
              <button
                onClick={handleDeclineConfirm}
                className="flex-1 py-4 text-sm text-red-400 font-bold hover:bg-red-500/10 transition-colors"
              >
                确定拒绝
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Agreement / Privacy Detail Modals */}
      {showAgreementModal === 'agreement' && (
        <AgreementModal title="用户服务协议" onClose={() => setShowAgreementModal(null)}>
          <UserAgreementContent />
        </AgreementModal>
      )}

      {showAgreementModal === 'privacy' && (
        <AgreementModal title="隐私政策" onClose={() => setShowAgreementModal(null)}>
          <PrivacyPolicyContent />
        </AgreementModal>
      )}
    </>
  );
};
