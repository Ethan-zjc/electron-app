<template>
    <div id="privacy-policy" class="protocol">
        <h3 class="title">隐私政策</h3>
        <div class="details">
            <p v-if="channel.includes('quickapp')">
                应用名称：快看{{ channel.includes('_mj') ? '漫剧' : '漫画' }}
            </p>
            <p v-if="channel !== 'qq'" class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">生效时间：2020年04月21日</span>
            </p>
            <p v-if="channel === 'qq'" class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">修改时间：2021年10月29日</span>
            </p>
            <p v-if="channel === 'qq'" class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">生效时间：2021年10月29日</span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    快看（以下称“我们”）非常重视保护用户（以下称“您”）个人信息。在您使用快看的服务时，我们将按照《快看隐私政策》（以下简称“本文”，本隐私政策适用于快看的{{
                        channel === 'harmony'
                            ? '原子化服务'
                            : `${
                                  channel.includes('quickapp') ? '快应用' : '小程序'
                              }版本的产品及服务`
                    }}）收集和使用您的个人信息。您应当在仔细阅读、充分理解本文后使用我们的服务。
                </span>
                <strong style="background-color: rgb(251, 251, 251)">
                    当您点击【同意】时，即表示您已理解本文，并同意我们按照本文规定的方式对您的信息进行收集和使用。
                </strong>
                <span style="background-color: rgb(251, 251, 251)">
                    如对本文内容有任何疑问、意见或建议，您可通过快看平台提供的各种方式联系我们。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">本文将帮助您了解以下内容：</span>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">一、我们如何收集您的个人信息</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">二、我们如何使用Cookie和同类技术</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">三、我们如何使用您的个人信息</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">四、我们如何保护您的个人信息</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">五、如何访问、更正、删除您的个人信息</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">六、未成年人信息保护</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">七、隐私政策的更新</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">八、联系我们</strong>
            </p>
            <p v-if="channel === 'qq'" class="ql-align-justify">
                <strong style="color: rgb(12, 12, 12)">九、调用QQ用户信息说明</strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    一、我们如何收集您的个人信息
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反应特定自然人活动情况的各种信息。
                </strong>
                <span style="background-color: rgb(251, 251, 251)">个人信息包括：</span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    个人基本资料（个人姓名、性别、民族、国籍、住址、出生日期、身份证号码、电话号码、电子邮箱等）；个人身份信息（身份证、社保卡、居住证等）、个人生物识别信息（指纹、声纹、掌纹、面部特征等）；网络身份标识信息（系统账号、IP地址、邮箱地址及其与前述有关的密码、口令、口令保护答案、用户个人数字证书等）；
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    个人财产信息（银行账号及密码、征信信息、交易和消费记录、流水记录等，以及虚拟货币、虚拟交易、游戏类兑换码等虚拟财产信息）；
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    个人通信信息（通信通讯联系方式、通信记录和内容、电子邮件、短彩信等）、联系人信息（通讯录、好友列表、群列表、电子邮件地址列表等）；
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    个人上网记录（指通过日志存储的用户操作记录，包括网站浏览记录、软件使用记录等）、个人常用设备信息（包括硬件序列号、设备MAC地址、软件列表、唯一设备识别码[如IMEI/android
                    ID/IDFA/OPENUDID/GUID\SIM卡IMSI信息等]）；
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    个人位置信息（如行踪轨迹、精准定位信息等）；
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">其他信息。</span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    个人敏感信息是指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息，个人敏感信息包括：身份证及身份证号码、手机号码、银行账号及密码、系统账号及密码、邮箱地址及密码、消费记录、地理位置信息等。
                </strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    在您使用快看服务的过程中，我们会按照如下方式收集您在使用服务时主动提供的或因为使用服务而产生的信息，用以向您提供、优化我们的服务以及保障您的账户安全：
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    <u>1.1注册及会员功能</u>
                </strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.1.1当您使用注册及会员功能时，我们会收集您的
                </span>
                <strong style="background-color: rgb(251, 251, 251)">手机号码</strong>
                <span style="background-color: rgb(251, 251, 251)">
                    、手机验证码匹配结果，用于为您创建快看平台账号、密码。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.1.2为了更好地为您提供{{
                        channel === 'quickapp' ? '' : '个性化'
                    }}服务，您可在注册时或后续使用过程中主动补充填写您的性别、生日、昵称、头像。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.1.3若您以其他方式关联登录快看平台，我们会向关联第三方请求您的个人信息。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">1.1.4</span>
                <strong style="background-color: rgb(251, 251, 251)">手机号码</strong>
                <span style="background-color: rgb(251, 251, 251)">
                    属于个人敏感信息，我们收集此类信息是为了满足相关法律法规的网络实名制要求。我们会在获得您同意或您主动提供的情况下收集您的
                </span>
                <strong style="background-color: rgb(251, 251, 251)">实名身份信息</strong>
                <span style="background-color: rgb(251, 251, 251)">，该信息属于</span>
                <strong style="background-color: rgb(251, 251, 251)">敏感信息</strong>
                <span style="background-color: rgb(251, 251, 251)">
                    ，拒绝提供实名身份信息可能会导致您无法登陆或在使用过程中受到相应限制。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.1.5当您进行付费、会员充值功能时，我们会收集您的余额、充值和使用情况、第三方交易凭证信息。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    <u>1.2{{ channel.includes('_mj') ? '漫剧' : '漫画' }}展示及浏览功能</u>
                </strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.2.1当您使用{{
                        channel.includes('_mj') ? '漫剧' : '漫画'
                    }}展示及浏览功能时，我们需要收集您的设备型号及制造商、设备屏幕信息、设备唯一标识符、浏览器类型和设置、语言设置、操作系统和应用程序版本、登录IP地址、接入网络的方式、网络状态、运营商类型、产品版本号、日志信息（如操作日志、服务日志）、用户ID、和{{
                        channel.includes('_mj') ? '漫剧' : '漫画'
                    }}浏览相关信息、图库。我们收集这些信息是为了向您提供我们最核心的{{
                        channel.includes('_mj') ? '漫剧' : '漫画'
                    }}展示及浏览、信息展示服务，如您拒绝提供可能导致您无法使用我们的服务。
                </span>
            </p>
            <p v-if="channel !== 'quickapp'" class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.2.2
                    我们会用1.2.1中收集到的您的个人信息，在首页、发现页、世界页进行漫画和帖子的个性化展示、推荐或者用于您的用户画像，以向您推荐您感兴趣的内容。这些信息，我们不会用于其他用途，且我们对收集到的您的个人信息已进行加密处理，因为不会对您的个人信息安全产生影响。如您想要清除这些信息，您可以通过点击【我的】-【设置】-【清除推荐画像】来对该信息进行清除操作。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)"><u>1.3搜索功能</u></strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.3.1当您使用搜索功能时，我们需要收集您使用的搜索词、用户ID信息。我们收集这些信息是为了向您提供您所需要的内容和{{
                        channel === 'quickapp' ? '' : '可能更感兴趣的'
                    }}服务，同时亦可以改进我们向您提供的服务。
                </span>
            </p>
            <p v-if="channel !== 'quickapp'" class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)"><u>1.4广告功能</u></strong>
            </p>
            <p v-if="channel !== 'quickapp'" class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.4.1当您使用广告功能时，我们需要收集您的设备标识、浏览内容、浏览广告的次数以及与它们互动的次数信息。我们收集这些信息是为了向您推荐更优质、您可能更感兴趣的广告内容。
                </span>
            </p>
            <p v-if="channel !== 'quickapp'" class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    1.4.2
                    个性化广告是广告展示技术之一，它依据用户行为或兴趣数据提供更相关的广告内容。我们仅提供对接技术，不会获取您在其他应用内的行为或个性数据。如您想要关闭个性化广告功能，您可以点击【我的】-【设置】-【广告屏蔽】-【个性化广告屏蔽】进行关闭状态设置。如您关闭个性化广告功能，您依然会看到广告，但这些广告不会依据您的兴趣展示。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    <u>{{ channel === 'quickapp' ? '1.4' : '1.5' }}意见反馈功能</u>
                </strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    {{
                        channel === 'quickapp' ? '1.4.1' : '1.5.1'
                    }}联系方式（电话、QQ、邮箱）、反馈意见、用户ID、设备型号、屏幕分辨率、操作系统信息。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    <u>{{ channel === 'quickapp' ? '1.5' : '1.6' }}经您同意后收集的其他信息。</u>
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    二、我们如何使用Cookie和同类技术
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    2.1为确保网站正常运转，我们会在您的计算机或移动设备上存储名为 Cookie
                    的小数据文件。Cookie
                    通常包含标识符、站点名称以及一些号码和字符。Cookie主要的功能是便于您使用网站产品和服务，以及帮助网站统计独立访客数量等。运用Cookie技术，我们能够为您提供更加周到的{{
                        channel === 'quickapp' ? '' : '个性化'
                    }}服务，并允许您设定您特定的服务选项。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    2.2在您使用我们的服务时，我们可能会使用Cookie或同类技术收集您的一些个人信息，例如：您访问网站的习惯、您的登录信息等，Cookie和同类技术收集该类信息是为了您使用我们的服务的必要、简化您重复操作的步骤（如注册、登录）、便于您查看使用历史（如浏览历史）、向您提供更切合您个人需要的服务内容{{
                        channel === 'quickapp' ? '' : '和您可能更感兴趣的内容'
                    }}、保护您的信息和账号安全性、改善我们的产品和服务等。我们承诺仅在本隐私政策所述目的范围内使用Cookie和同类技术。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    2.3如果您的浏览器允许，您可以通过您的浏览器的设置以管理、（部分/全部）拒绝Cookie或同类技术；或删除已经储存在您的计算机、移动设备或其他装置内的Cookie或同类技术文件，从而实现我们无法全部或部分追踪您的个人信息。您如需详细了解如何更改浏览器设置，请具体查看您使用的浏览器的相关设置页面。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    三、我们如何使用您的个人信息
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)"><u>3.1共享</u></strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    您的个人信息是我们为您提供服务的重要依据和组成部分，对于您的个人信息，我们仅在本文所述的目的和范围内或根据法律法规的要求收集和使用，并严格保密，我们不会向第三方共享您的个人信息，除非存在以下一项或多项情形：
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.1.1事先征得您的明确授权同意；
                </strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">3.1.2您主动提出的要求；</span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    3.1.3根据法律法规规定、诉讼争议解决需要，或者行政、司法机关依照法律法规提出的要求；
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    3.1.4将您的个人信息与快看的关联方共享。但快看只会共享必要的个人信息，且受本文的约束。快看的关联方如要改变个人信息的处理目的，将再次征求您的授权同意。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    3.1.5为了保护您、快看、其他用户的权利及财产安全或社会公共利益使其免遭损害而与第三方的共享；
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.1.6与部分业务合作伙伴的必要共享：您理解并知悉，为了必要且合理的业务的顺利展开，履行我们在相关用户协议或本隐私政策中的义务，我们可能会向合作伙伴等第三方共享您的信息。
                </strong>
                <span style="background-color: rgb(251, 251, 251)">
                    但我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。对我们与之共享个人信息的公司、组织和个人，我们会要求其遵守保密约定，要求他们按照快看的说明、本文以及其他任何相关的保密和安全措施来处理个人信息。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    3.1.7其他法律法规等规定，司法机关或行政机关要求的情形。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)"><u>3.2转让</u></strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">3.2.1</span>
                <strong style="background-color: rgb(251, 251, 251)">
                    事先获得您的明确授权或同意
                </strong>
                <span style="background-color: rgb(251, 251, 251)">；</span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    3.2.2为满足法律法规、程序的要求或强制性的政府要求或司法裁定；
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    3.2.3如果我们或我们的关联公司涉及合并、分立、清算、资产或业务的收购或出售等交易，您的个人信息有可能作为此类交易的一部分而被转移，我们将确保该等信息在转移过程中的保密性，并尽最大可能确保新的持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向您征求您的授权同意。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)"><u>3.3公开披露</u></strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    我们仅会在以下情况下，公开披露您的个人信息：
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.3.1获得您的明确同意；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.3.2基于法律法规、程序、诉讼或政府主管部门强制性要求下。
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">3.4例外</strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    在以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.1与国家安全、国防安全直接相关的；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.2与公共安全、公共卫生、重大公共利益直接相关的；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.3与犯罪侦查、起诉、审判和判决执行等直接相关的；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.4出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.5您自行向社会公众公开的个人信息；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.6从合法公开披露的信息中收集的个人信息，如合法的新闻报道、政府信息公开等渠道；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.7根据与您签订和履行的相关协议或其他书面文件所必需的；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.8对收集的个人信息已经进行匿名化或去标识化处理的；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.9为合法的新闻报道所必需的；
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.10做学术研究用途，例如为科研机构开展统计或学术研究之必要
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    3.4.11其他法律法规等规定的情形。
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    四、我们如何保护您的个人信息
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    4.1
                    为保障您的个人信息安全，我们努力采取各种合理的物理、电子和管理方面的安全措施来保护您的个人信息，使您的信息不会被泄漏、毁损或者丢失，包括但不限于SSL、信息加密存储、数据中心的访问控制等。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    4.2
                    我们将按照《网络安全法》等法律法规的要求保存您的个人信息。您的个人信息均储存于中华人民共和国境内，如我们需要向境外传输您的个人信息，我们会严格按照法律法规的规定及要求执行，并保证您的个人信息安全。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    4.3
                    我们将保存您的个人信息不少于六个月，最长不超过20年。时间到期后，我们会将您的个人信息匿名化处理，以保证您的个人信息安全。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    4.4
                    我们仅允许有必要知晓您的个人信息的员工知晓您的个人信息，并为此设置了严格的访问权限控制和监控机制。
                </strong>
                <span style="background-color: rgb(251, 251, 251)">
                    我们对可能接触到您的个人信息的员工或外包人员也采取了严格管理，包括但不限于根据岗位的不同采取不同的权限控制，与他们签署保密协议，监控他们的操作情况等措施。我们建立了完善的信息安全管理制度和内部安全事件处置机制，我们会定期对负责人员及员工进行信息安全管理培训。我们会采取适当的符合业界标准的安全措施和技术手段存储和保护您的个人信息，以防止您的信息丢失、遭到被未经授权的访问、公开披露、使用、修改、毁损、丢失或泄漏。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    4.5我们会按现有技术提供相应的安全措施来保护您的信息，提供合理的安全保障，我们将尽力做到使您的个人信息不被泄漏、毁损或丢失。如不幸发生个人信息安全事件的，我们将按照法律法规的要求，及时向您告知安全事件的基本情况和可能产生的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们会及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    4.6
                    请您知悉并理解，互联网并非绝对安全的环境，我们强烈建议您通过安全方式、使用复杂密码等手段协助我们保证您的账号安全。如您发现自己的个人信息泄密，尤其是您的账号或密码发生泄露，请您立即根据本文中提供的联系方式联系我们，以便我们及时采取相应措施来保护您的个人信息安全。
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    五、如何访问、更正、删除您的个人信息
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    5.1
                    您通过第三方服务平台使用快看平台服务的，快看会间接向第三方收集您在该平台的身份信息，如昵称、头像，以识别您的身份，向您提供服务。
                </span>
            </p>
            <p class="ql-align-justify">
                <span>5.2您希望注销快看平台账号的，可以通过邮箱</span>
                <strong style="background-color: rgb(251, 251, 251)">
                    Dataprivacy@kkworld.com
                </strong>
                <span>
                    与我们联系并要求我们注销您的账号或删除您的信息。在您注销您的账号之前，我们将验证您的个人身份、安全状态、常用设备等信息。
                </span>
            </p>
            <p class="ql-align-justify">
                <span>5.3如您需要您的个人信息的副本，您可以通过邮箱</span>
                <strong style="background-color: rgb(251, 251, 251)">
                    Dataprivacy@kkworld.com
                </strong>
                <span>
                    联系我们，在核实您的身份后，我们将向您提供您在使用快看平台服务中的个人信息副本（例如基本资料、身份信息），但法律法规另有规定的或本隐私政策另有约定的除外。
                </span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    5.4此外，如果您无法访问、更正或删除您的个人信息，或您需要访问、更正或删除您在使用快看平台服务时所产生的其他个人信息，或您认为我们存在任何违反法律法规或与您关于个人信息的收集或使用的约定的行为，您可通过邮箱Dataprivacy@kkworld.com与我们进行联系，您的意见将会得到及时的处理。
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">六、未成年人信息保护</strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    6.1 快看提示父母或监护人指导未满十八周岁的未成年人使用快看所提供的服务。
                </span>
                <strong style="background-color: rgb(251, 251, 251)">
                    如您为未成年人，快看建议您请您的父母或监护人仔细阅读本文，并建议您在提交个人信息之前寻求父母或监护人的同意和指导。
                </strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    6.2
                    我们将根据国家相关法律法规保护未成年人的个人信息。如果任何时候监护人有理由相信我们在未获得监护人同意的情况下收集了未成年人的个人信息，请联系我们，我们会采取措施尽快删除相关信息。
                </span>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">七、隐私政策的更新</strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    7.1 我们鼓励您在每次使用我们的服务时都查阅我们的隐私政策。
                </span>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    7.2
                    您理解并同意，为了更好的向您提供服务，我们需要适时根据快看平台产品及服务的发展情况，对本隐私政策进行修订及更新。我们会在快看平台显著位置发布更新后的隐私政策，
                </span>
                <strong style="background-color: rgb(251, 251, 251)">
                    如您不同意更新后的隐私政策内容，您应不使用或立即停止使用快看平台服务。
                </strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">八、联系我们</strong>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    当您有其他的投诉、建议、未成年人个人信息相关问题时，请将您的问题发送
                </span>
                <strong style="background-color: rgb(251, 251, 251)">
                    Dataprivacy@kkworld.com
                </strong>
                <span style="background-color: rgb(251, 251, 251)">或寄到如下地址：</span>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    快看世界（北京）科技有限公司
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">
                    中国北京市朝阳区安定路5号院5号楼12层08单元
                </strong>
            </p>
            <p class="ql-align-justify">
                <strong style="background-color: rgb(251, 251, 251)">邮编：100020</strong>
            </p>
            <p class="ql-align-justify">
                <span style="background-color: rgb(251, 251, 251)">
                    我们将尽快审核所涉问题，并在验证您的用户身份后的
                </span>
                <strong style="background-color: rgb(251, 251, 251)">十五天内</strong>
                <span style="background-color: rgb(251, 251, 251)">予以回复。</span>
            </p>
            <p class="ql-align-justify"><br /></p>
            <p class="ql-align-justify"><br /></p>

            <div v-if="channel === 'qq'">
                <p class="ql-align-justify">
                    <strong style="background-color: rgb(251, 251, 251)">
                        九、调用QQ用户信息说明
                    </strong>
                </p>
                <p class="ql-align-justify"><br /></p>
                <p class="ql-align-justify">
                    <span style="background-color: rgb(251, 251, 251)">
                        以下为我们调用的QQ
                        API的名称、用户信息获取、使用目的及其隐私协议地址说明，便于您清楚的了解您的个人信息使用、保护情况：
                    </span>
                </p>
                <p class="ql-align-justify">
                    <span style="background-color: rgb(251, 251, 251)">
                        API接口名称：qq.getUserInfo
                    </span>
                </p>
                <p class="ql-align-justify">
                    <span style="background-color: rgb(251, 251, 251)">
                        信息获取：用户信息（昵称、性别、头像、国家/省份/城市、语言）
                    </span>
                </p>
                <p class="ql-align-justify">
                    <span style="background-color: rgb(251, 251, 251)">
                        使用目的：创建快看QQ小程序用户账号、依据用户性别进行漫画内容推荐。
                    </span>
                </p>
                <p class="ql-align-justify">
                    <span style="background-color: rgb(251, 251, 251)">隐私协议地址：</span>
                </p>
                <p class="ql-align-justify">
                    <span style="background-color: rgb(251, 251, 251)">
                        <a href="https://privacy.qq.com/policy/tencent-privacypolicy">
                            https://privacy.qq.com/policy/tencent-privacypolicy
                        </a>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const channel = ref('wechat');
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
#privacy-policy {
    h3 {
        font-weight: normal;
        color: #000;
        font-size: vws(32);
    }

    h4 {
        font-weight: normal;
        margin: vws(56) 0 vws(16) 0;
        font-size: vws(28);
        color: #000;
    }

    p,
    ul,
    li {
        margin: 0;
        padding: 0;
    }

    li {
        text-align: justify;
        list-style: none;
        line-height: 1.8;
        font-size: vws(24);
    }

    p {
        text-align: justify;
        line-height: 1.8;
        font-size: vws(24);
        color: #666;
    }

    a {
        color: #5da4bd;
        font-size: vws(28);
    }

    .underline {
        text-decoration: underline;
    }

    &.protocol {
        margin: 0 auto;
        max-width: vws(1600);
        padding: vws(28);
    }

    .hide {
        display: none;
    }

    img {
        max-width: 100%;
    }

    .ql-align-right {
        text-align: right;
    }
}
</style>
