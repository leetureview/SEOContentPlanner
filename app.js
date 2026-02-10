/* ============================================
   SEO Content Planner - Application Logic
   ============================================ */

// ============================================
// Configuration & State
// ============================================

const APP_CONFIG = {
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    defaultModel: 'gemini-2.0-flash',
    storageKeys: {
        apiKey: 'seo_planner_api_key',
        model: 'seo_planner_model',
        theme: 'seo_planner_theme',
        recentKeywords: 'seo_planner_recent',
        promptTemplate: 'seo_planner_pr1',
        keywordPrompt: 'seo_planner_keyword_prompt',
        contentPrompt: 'seo_planner_content_prompt'
    }
};

const DEFAULT_CONTENT_PROMPT = `###[Viết một bài viết dài tối đa 3000 từ bằng tiếng việt về chủ đề “\${title}” được tối ưu hóa cho SEO nhằm mục đích xuất hiện nổi bật trên Google Discovery và đứng đầu kết quả tìm kiếm của Google. Đồng thời đáp ứng tất cả các tiêu chí bên dưới:]
Đối tượng chính xem Nội dung này:
###[Ý định tìm kiếm của người dùng: \${intent}]
###[Hãy viết một tiêu đề bài viết chuẩn SEO, có độ dài từ 6 đến 9 từ, với từ khóa chính và phải đặt ở đầu tiêu đề. Tiêu đề phải viết hoa chữ cái đầu của mỗi từ, thể hiện đúng và trả lời đầy đủ ngữ cảnh tìm kiếm của người dùng khi search từ khóa này, bao gồm cả định nghĩa, ứng dụng và lợi ích của nó]
###[Viết đoạn mở bài dài 2 câu tối đa 80 chữ cho bài viết về từ khóa chính, giải quyết ngay vấn đề được đề cập, có sử dụng từ khóa đến “taxi123go.vn”. Câu đầu tiên phải bắt đầu bằng từ khóa chính và bao gồm các từ khóa ngữ nghĩa liên quan, trỏ internal link về chính nó.  Sử dụng ngôn ngữ tích cực, thân thiện, không dùng tiếng Anh.  Đưa ra giải pháp. Đoạn cuối mở bài thêm 2-3 từ khóa LSI. Sử dụng từ đồng nghĩa với từ khóa chính.]
Lưu ý:
###[Phải sử dụng số liệu, diễn giải, tính toán chi tiết cho người đọc hiểu]
###[Phải tạo bảng, sử dụng số liệu trực quan dễ nhìn, tối ưu UX/UI cho khách]
###[Nội tập trung giải quyết search intent không diễn giải dài dòng, lan man]
###[Nội dung được tạo ra để phục vụ người Việt Nam, phù hợp với văn hóa việt Nam]
###[Nội dung đem lại cảm giác mong muốn tìm hiểu chi tiết nội dung bài viết]
###[Cập nhật thông tin mới nhất theo dữ liệu có được]
Mục đích của Bài Viết:
###[Được đối tượng chia sẻ, lưu lại, ghim bài]
###[Để lại thông tin, đặt xe taxi các tuyến đường dài về dịch vụ taxi]
###[Tuyệt đối Không sử dụng dấu chấm cảm (!) và dấu ngoặc kép (“”) trong nội dung văn bản]
Yêu cầu trong bài Viết:
###[Các thẻ heading sử dụng trong bài viết gồm H2, H3 (Hoặc H4 nếu cần chi tiết)]
###[Nội dung bài viết phải có ví dụ, trích dẫn nghiên cứu khoa học, thông tin chính thống từ nguồn uy tín ở Việt Nam]
###[Hướng dẫn chi tiết rõ ràng từng bước, có số liệu cụ thể]
###[Sử dụng danh xưng là “taxi 123 Go”]
###[Bài viết phải hướng dẫn rõ ràng, chi tiết, từng bước thực hiện]
###[Bài viết nếu có nói tới dịch vụ taxi 123 go, thì nên nhắc những ưu điểm như có xe điện minio green chạy giá 8.000 VNĐ rẻ hơn các hãng khác. Sử dụng app tiện lợi, thông minh, minh bạch về giá, tài xế chuyên nghiệp, xe sạch sẻ, êm ru. Ngoài xe minio green, còn có cung cấp các dịch vụ xe herio green giá 10.000 VNĐ và xe limo green giá 12.000 VNĐ, để cho khách nhiều sự lựa chọn]
###[Kêu gọi khách hàng nên tải app và để lại thông tin đặt xe , tại website “taxi123go.vn”, Hotline: 02623.888.123, Địa chỉ: 18 Lê Quý Đôn, Xã Krông Ana, tỉnh Đăk Lăk]
Triển khai bài viết:
###[Bài viết được triển khai với từ khóa chính là “\${keywords}” dài tối đa 2000 chữ. Nội dung cung cấp phải đáp ứng 100% các ý định tìm kiếm (Search intents) của người dùng được đề cập ở trên]
###[Bài viết được triển khai với H2 đầu tiên là ý định tìm kiếm quan trọng nhất ở “\${title}”. Ví dụ Tilte là “Top 9 Mẫu Rèm Cửa Đẹp Giá Rẻ Bán Chạy Nhất (Kèm Bảng Báo Giá)” thì H2 đầu tiên phải triển khai ngay “Top 9 Mẫu Rèm Cửa Đẹp” còn lại các H2 tiếp theo như: Rèm cửa là gì?… thì sẽ được triển khai sau]
###[Bạn chắc chắn phải viết các đoạn văn theo cách tích cực nhất và đạt điểm Toàn bộ tài liệu của google NLP nhưng vẫn giữ nguyên ý nghĩa của nó, Tối thiểu phải lớn hơn 0,5]
###[Mỗi tiêu đề H2, H3 bắt buộc là câu hỏi, Dưới câu hỏi là câu trả lời ngắn giúp người đọc giải quyết được vấn đề, sau câu trả lời ngắn là nội dung được triển khai chi tiết]
###[Tập trung vào việc sử dụng ngôn ngữ và cấu trúc câu tích cực trong khi vẫn truyền tải thông tin chính xác.]
###[Thay vì nhấn mạnh vào hình phạt và hậu quả tiêu cực, hãy tập trung vào lợi ích của việc tuân thủ luật pháp và duy trì phạm vi bảo hiểm đầy đủ.]
###[Phải sử dụng số liệu, diễn giải, tính toán chi tiết cho người đọc hiểu]
###[Cung cấp các ví dụ và giả định về kết quả tích cực]
###[Cho phép linh hoạt trong việc lựa chọn các từ đồng nghĩa phù hợp nhất với ngữ cảnh và gợi lên cảm xúc tích cực, thay vì bắt buộc sử dụng chúng một cách nghiêm ngặt.]
###[Tiêu đề 2 dài tối đa 220 ký tự, Tiêu đề 3 dài tối đa 180 ký tự]
###[Bài viết phải tuân thủ các tiêu chuẩn E-E-A-T (Kinh nghiệm, Chuyên môn, Quyền hạn và Độ tin cậy) và YMYL (Tiền bạc hoặc Cuộc sống của bạn) và được tối ưu hóa Onpage]
###[Các yêu chuẩn E-E-A-T (Kinh nghiệm, Chuyên môn, Quyền hạn và Độ tin cậy)
###[Sử dụng định dạng bảng và danh sách khi liệt kê tên gọi tối đa 3 cột]
###[Phải liệt kê đủ số tên ở Tiêu đề đưa ra]
###[Các bài viết xuất hiện trên Google Discovery, do đó nó phải được tối ưu hóa một cách chuyên nghiệp để thu hút sự chú ý của người đọc và đáp ứng các nguyên tắc của Google]
###[Sử dụng các thuật ngữ chuyên ngành một cách chính xác, nhưng cần giải thích rõ ràng để người đọc dễ hiểu]
###[Sử dụng các số liệu thống kê, biểu đồ để minh họa cho những phân tích của bạn]
###[Cập nhật thông tin mới nhất có thể là định nghĩa, số liệu thống kê (số lượng, khối lượng, thời gian), văn bản pháp luật,… (chi tiết rõ ràng) và lập bảng cho nội dung sản xuất]
###[Cuối nội dung bài viết trích dẫn 5 nguồn nội dung để tạo nên bài viết. Nguồn phải từ các trang website uy tín ở việt Nam, và trên thế giới. Theo cú pháp: Tiêu đề bài viết: URL]
###[Dựa trên từ khóa chính là “\${keywords}” hãy tự động thống kê ra thêm các từ khóa ở mỗi nhóm theo liệt kê, mỗi nhóm ít nhất 5 từ: Từ khóa chính (Primary Keyword), Từ khóa liên quan (Related Keywords), Từ khóa dài (Long-tail Keywords), Từ khóa đồng nghĩa (Synonyms), Từ khóa ngữ cảnh (Contextual Keywords), Từ khóa LSI (Salient LSI keywords), Thực thể LSI (Semantic LSI entities), Thực thể nổi bật (Salient entities), Chủ đề liên quan đến từ khóa chính (Related topics), Thuộc tính gốc ( Root attributes), Thuộc tính hiếm (Rare attributes), Đặc điểm độc đáo (Unique characteristics). Và sau đó thêm tất cả các từ khóa này vào nội dung bài viết không cần liệt kê ra]
###[Thêm tất cả các từ khóa này vào nội dung bài viết: “\${groupKey}”]
###[Dùng link chuẩn canonical. Thay vì chỉ để href="taxi-bmt-di-ea-sup", bạn nên dùng đường dẫn đầy đủ như <a href="/taxi-bmt-di-ea-sup/">taxi Buôn Ma Thuột đi Ea Súp</a>]
###[Gợi ý ít nhất 3 vị trí đặt ảnh trong bài viết. Với mỗi vị trí, hãy cung cấp mô tả chi tiết về nội dung ảnh và thẻ Alt text chuẩn SEO. Định dạng: [ẢNH x: Mô tả nội dung ảnh | Alt: Thẻ alt chi tiết]]
Định dạng nội dung tạo ra phải làm đúng các yếu tố bên dưới:
###[Triển khai lại toàn bộ file HTML bên trên sử dụng CSS nội tuyến, giữ đầy đủ nội dung text, kích thước full witch giúp bài viết dễ đọc và tối ưu hơn tối ưu UX/UI cực đẹp cho mọi người xem]
###[Chuyển các H2, H3 thành câu hỏi]
###[Dưới câu hỏi là các câu trả lời ngắn trực tiếp vào vấn đề được hỏi ở tiêu đề 2(H2), và tiêu đề 3(H3). Cập nhật nội dung số liệu mới nhất. Highlight và tạo thẻ Quotes cho câu trả lời ngắn này]
###[Giữ lại nội dung text HTML nếu đúng, còn không thì cập nhật thêm, không bỏ hay lượt bớt nội dung]
###[Dưới câu trả lời ngắn là nội dung chi tiết của file HTML được cập nhật thêm dữ liệu mới nhất và có số liệu cụ thể]
###[Nội dung xuất ra là HTML dành cho website wordpress Flatsome]
###[Text được canh đều 2 bên]
###[Màu chủ đạo màu xanh da trời]
###[Tối ưu CSS Nội Tuyến,để không có khoảng trống ở đầu văn bản]
###[Không diễn giải file HTML kiểu như: /* —– CÀI ĐẶT TỔNG THỂ —– */, Chỉ cần xuất ra đúng các HTML mà không cần giải thích]
###[Mẫu nội dung được tối ưu UX/UI, sử dụng CSS nội tuyến giống mẫu HTML bên dưới:]
<div class="section-card">

[rank_math_breadcrumb]
<p style="font-size: 17px; color: #555;"><a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/sdt-taxi-phuong-dong-krông-ana">Số điện thoại taxi Phương Đông Krông Ana</a> là thông tin bạn cần để gọi xe di chuyển nhanh chóng tại địa phương, được chúng tôi cập nhật chính xác nhất cho năm 2025. Để có một lựa chọn tối ưu hơn về giá cả và sự tiện lợi, hãy trải nghiệm dịch vụ của Taxi 123 Go tại taxi123go.vn, nơi cung cấp giải pháp đặt xe công nghệ hiện đại. Tổng đài taxi, hãng xe địa phương, dịch vụ uy tín.</p>

<h2 style="color: #3bbeb9; font-size: 32px; border-bottom: 3px solid #F47E52; padding-bottom: 15px; margin-bottom: 25px; font-weight: 600;">Số Điện Thoại Taxi Phương Đông Krông Ana Chính Xác Nhất 2025 Là Gì?</h2>
<blockquote>
<p style="font-size: 17px; color: #555; background-color: #eef9f8; border-left: 5px solid #3BBEB9; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">Số điện thoại chính thức và được cập nhật mới nhất năm 2025 của Taxi Phương Đông Krông Ana là 0948.444.666. Đây là số tổng đài hoạt động 24/7 để bạn có thể <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/sdt-taxi-phuong-dong-krông-ana">gọi xe taxi Phương Đông</a> bất cứ lúc nào.</p>
</blockquote>
<p style="font-size: 17px; color: #555;">Khi có nhu cầu di chuyển tại huyện Krông Ana, việc nắm trong tay số điện thoại của một hãng xe địa phương uy tín là điều vô cùng cần thiết. Taxi 123 Go đã xác thực và xin cung cấp thông tin chính xác nhất để bạn dễ dàng liên hệ. Việc lưu lại số điện thoại này vào danh bạ giúp bạn chủ động hơn trong mọi hành trình, từ những chuyến đi trong thị trấn Buôn Trấp đến các xã lân cận.</p>

<div style="text-align: center; margin: 30px 0; padding: 25px; background-color: #f0f8ff; border: 2px dashed #3BBEB9; border-radius: 10px;">
<p style="font-size: 24px; font-weight: bold; color: #2a9d8f; margin: 0;">Hotline Taxi Phương Đông Krông Ana:</p>
<p style="font-size: 48px; font-weight: 900; color: #f47e52; margin: 15px 0;"><a style="color: #f47e52; text-decoration: none;" href="tel:0948444666">0948.444.666</a></p>
<p style="font-size: 18px; color: #555; margin: 0;">(Phục vụ 24/7, gọi là có xe)</p>

</div>
<p style="font-size: 17px; color: #555;">Đây là <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/sdt-taxi-phuong-dong-krông-ana">số taxi Phương Đông Buôn Trấp</a> mà bạn có thể tin cậy để đặt xe cho nhiều mục đích khác nhau, dù là đi công việc, thăm người thân hay di chuyển khẩn cấp. Theo thông tin đăng ký, Công ty TNHH Taxi Phương Đông có địa chỉ tại Số 203 Hùng Vương, Xã Krông Ana, Tỉnh Đắk Lắk, điều này khẳng định sự hiện diện hợp pháp và cam kết phục vụ lâu dài tại địa phương. Sự am hiểu địa bàn của các tài xế là một lợi thế lớn, giúp hành trình của bạn trở nên suôn sẻ và nhanh chóng hơn.</p>

</div>
<h2 style="color: #3bbeb9; font-size: 32px; border-bottom: 3px solid #F47E52; padding-bottom: 15px; margin-bottom: 25px; font-weight: 600;">Tại Sao Taxi Phương Đông Krông Ana Lại Là Một Lựa Chọn Đáng Tin Cậy?</h2>
<blockquote>
<p style="font-size: 17px; color: #555; background-color: #eef9f8; border-left: 5px solid #3BBEB9; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">Taxi Phương Đông được xem là lựa chọn đáng tin cậy vì đây là một hãng xe địa phương lâu năm, có đội ngũ tài xế thông thạo đường sá, mức giá hợp lý và luôn sẵn sàng phục vụ nhanh chóng. Những yếu tố này tạo nên sự an tâm và tiện lợi cho khách hàng khi cần một phương tiện di chuyển quen thuộc.</p>
</blockquote>
<p style="font-size: 17px; color: #555;">Việc tìm hiểu xem một hãng taxi có uy tín không là một trong những ý định tìm kiếm quan trọng của người dùng. Dựa trên các <strong style="color: #f47e52;">đánh giá taxi Phương Đông Krông Ana</strong> từ cộng đồng, có thể thấy hãng xe này đã xây dựng được niềm tin nhờ những ưu điểm sau:</p>

<ul style="font-size: 17px; color: #555; list-style: none; padding-left: 0;">
 	<li style="margin-bottom: 15px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #3bbeb9; font-weight: bold;">✓</span> <strong style="color: #2a9d8f;">Am Hiểu Địa Bàn:</strong> Tài xế là người địa phương nên thông thuộc mọi nẻo đường tại Krông Ana, giúp rút ngắn thời gian di chuyển và đưa bạn đến đúng nơi cần đến một cách chính xác.</li>
 	<li style="margin-bottom: 15px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #3bbeb9; font-weight: bold;">✓</span> <strong style="color: #2a9d8f;">Phục Vụ Nhanh Chóng:</strong> Với lợi thế là hãng xe tại chỗ, việc điều phối xe thường rất nhanh, đặc biệt khi bạn cần một chiếc <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/taxi-buon-trap">taxi Buôn Trấp</a> gấp.</li>
 	<li style="margin-bottom: 15px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #3bbeb9; font-weight: bold;">✓</span> <strong style="color: #2a9d8f;">Giá Cả Phải Chăng:</strong> Mức giá của các hãng taxi địa phương thường khá cạnh tranh và phù hợp với mặt bằng chung, giúp bạn dự trù kinh phí hiệu quả.</li>
 	<li style="margin-bottom: 15px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #3bbeb9; font-weight: bold;">✓</span> <strong style="color: #2a9d8f;">Linh Hoạt Tuyến Đường:</strong> Hãng nhận chở khách không chỉ trong huyện mà còn các tuyến đường dài như <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/taxi-krong-ana-di-bmt">taxi Krông Ana đi Buôn Ma Thuột</a>, đáp ứng đa dạng nhu cầu của hành khách.</li>
</ul>
<p style="font-size: 17px; color: #555;">Những đặc điểm này giúp Taxi Phương Đông trở thành một lựa chọn quen thuộc và là một trong những sự lựa chọn khác biệt khi so sánh với các hãng lớn hơn. Bên cạnh đó, bạn cũng có thể tham khảo thêm <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/sdt-taxi-hai-han-krong-ana">số điện thoại taxi Hải Hân Krông Ana</a> để có thêm sự lựa chọn.</p>

<h2 style="color: #3bbeb9; font-size: 32px; border-bottom: 3px solid #F47E52; padding-bottom: 15px; margin-bottom: 25px; font-weight: 600;">Nên Lựa Chọn Taxi Phương Đông Hay Một Dịch Vụ Khác Tại Krông Ana?</h2>
<blockquote>
<p style="font-size: 17px; color: #555; background-color: #eef9f8; border-left: 5px solid #3BBEB9; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">Việc lựa chọn dịch vụ taxi phụ thuộc vào ưu tiên của bạn. Nếu bạn cần sự quen thuộc và nhanh chóng tại địa phương, Taxi Phương Đông là lựa chọn tốt. Tuy nhiên, nếu bạn ưu tiên giá cước rẻ, sự minh bạch và tiện ích công nghệ hiện đại, Taxi 123 Go sẽ là giải pháp tối ưu hơn hẳn.</p>
</blockquote>
<p style="font-size: 17px; color: #555;">Để giúp bạn có quyết định tốt nhất, việc so sánh dịch vụ là rất quan trọng. Dưới đây là bảng phân tích chi tiết giữa Taxi Phương Đông và Taxi 123 Go, một dịch vụ taxi công nghệ đang được ưa chuộng tại <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/taxi-daklak">taxi Daklak</a>.</p>

<div class="table-responsive" style="overflow-x: auto; margin-top: 20px;">
<table style="width: 100%; border-collapse: collapse; text-align: left;">
<thead style="background-color: #3bbeb9; color: white;">
<tr>
<th style="padding: 12px 15px; border: 1px solid #ddd;">Tiêu Chí So Sánh</th>
<th style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Taxi Phương Đông</th>
<th style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Taxi 123 Go</th>
</tr>
</thead>
<tbody>
<tr style="background-color: #f9f9f9;">
<td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; color: #333;">Giá Cước (Xe 4 chỗ)</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Khoảng 11.000 - 13.000 VNĐ/km</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #f47e52;">Chỉ từ 8.000 VNĐ/km (Xe Minio Green)</td>
</tr>
<tr>
<td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; color: #333;">Phương Thức Đặt Xe</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Gọi tổng đài truyền thống</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Ứng dụng, Website, Hotline</td>
</tr>
<tr style="background-color: #f9f9f9;">
<td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; color: #333;">Minh Bạch Giá</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Hỏi tổng đài/tài xế</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Biết trước giá trọn gói trên app</td>
</tr>
<tr>
<td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; color: #333;">Chất Lượng Xe</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Xe phổ thông, sạch sẽ</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Xe điện đời mới, êm ái, sạch sẽ</td>
</tr>
<tr style="background-color: #f9f9f9;">
<td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; color: #333;">Đa Dạng Lựa Chọn</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Xe 4 chỗ, 7 chỗ</td>
<td style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Minio Green, Herio Green, Limo Green</td>
</tr>
</tbody>
</table>
</div>
<h3 style="color: #f47e52; font-size: 22px; margin-top: 30px;">Khi Nào Bạn Nên Ưu Tiên Lựa Chọn Taxi 123 Go?</h3>
<blockquote>
<p style="font-size: 17px; color: #555; background-color: #fff8f5; border-left: 5px solid #F47E52; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">Bạn nên ưu tiên chọn Taxi 123 Go khi muốn tiết kiệm chi phí tối đa với giá chỉ từ 8.000 VNĐ/km, cần biết trước giá chuyến đi một cách minh bạch, và mong muốn trải nghiệm sự tiện lợi của việc đặt xe qua ứng dụng công nghệ với nhiều loại xe điện hiện đại.</p>
</blockquote>
<p style="font-size: 17px; color: #555;">Qua bảng so sánh, có thể thấy Taxi 123 Go mang lại nhiều lợi ích vượt trội. Với mức giá cạnh tranh nhất thị trường, bạn có thể tiết kiệm một khoản chi phí đáng kể, đặc biệt cho các chuyến đi xa. Việc biết trước giá cước qua ứng dụng cũng giúp bạn hoàn toàn yên tâm, không lo lắng về các chi phí phát sinh. Hơn nữa, dàn xe điện êm ái, thân thiện với môi trường cùng đội ngũ tài xế chuyên nghiệp chắc chắn sẽ mang đến cho bạn một trải nghiệm di chuyển hài lòng. Tham khảo thêm <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/gia-cuoc-taxi-krong-ana">giá cước taxi Krông Ana</a> của các hãng khác cũng là một ý hay. Để có thêm lựa chọn, bạn có thể tìm hiểu <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn/sdt-taxi-thinh-phat-krong-ana">số điện thoại taxi Thịnh Phát Krông Ana</a>.</p>

<h2 style="color: #3bbeb9; font-size: 32px; border-bottom: 3px solid #F47E52; padding-bottom: 15px; margin-bottom: 25px; font-weight: 600;">Làm Cách Nào Để Đặt Xe Taxi 123 Go Tại Krông Ana Một Cách Tiện Lợi Nhất?</h2>
<blockquote>
<p style="font-size: 17px; color: #555; background-color: #eef9f8; border-left: 5px solid #3BBEB9; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">Cách tiện lợi nhất để đặt xe Taxi 123 Go tại Krông Ana là tải ứng dụng Taxi 123 Go trên điện thoại. Ngoài ra, bạn cũng có thể truy cập website taxi123go.vn hoặc gọi trực tiếp đến hotline 0263.999.123 để được hỗ trợ đặt xe 24/7.</p>
</blockquote>
<p style="font-size: 17px; color: #555;">Taxi 123 Go mang đến nhiều phương thức đặt xe linh hoạt để bạn lựa chọn, đảm bảo bạn luôn có thể gọi xe một cách dễ dàng nhất, dù bạn đang ở bất kỳ đâu tại Krông Ana.</p>

<h3 style="color: #f47e52; font-size: 22px; margin-top: 30px;">Các Bước Đặt Xe Qua Ứng Dụng Taxi 123 Go Như Thế Nào?</h3>
<blockquote>
<p style="font-size: 17px; color: #555; background-color: #fff8f5; border-left: 5px solid #F47E52; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">Chỉ với 4 bước đơn giản: Tải ứng dụng và đăng ký, nhập điểm đón và điểm đến, chọn loại xe và xem trước giá cước, cuối cùng là xác nhận đặt xe và theo dõi hành trình của tài xế. Quá trình này nhanh chóng, minh bạch và vô cùng tiện lợi.</p>
</blockquote>
<ol style="font-size: 17px; color: #555; padding-left: 20px;">
 	<li style="margin-bottom: 10px;"><strong style="color: #2a9d8f;">Tải App:</strong> Tìm kiếm Taxi 123 Go trên App Store hoặc Google Play và cài đặt.</li>
 	<li style="margin-bottom: 10px;"><strong style="color: #2a9d8f;">Nhập Lộ Trình:</strong> Mở app, nhập điểm đi và điểm đến của bạn.</li>
 	<li style="margin-bottom: 10px;"><strong style="color: #2a9d8f;">Chọn Xe và Giá:</strong> Lựa chọn loại xe bạn muốn (Minio, Herio, Limo Green) và xem giá cước trọn gói hiển thị ngay lập tức.</li>
 	<li style="margin-bottom: 10px;"><strong style="color: #2a9d8f;">Xác Nhận:</strong> Nhấn nút Đặt xe và tài xế gần nhất sẽ đến đón bạn trong vài phút.</li>
</ol>
<div style="margin-top: 30px; padding: 25px; background-color: #eef9f8; border-left: 5px solid #3BBEB9; border-radius: 8px; text-align: center;">
<h3 style="color: #3bbeb9; margin: 0 0 15px 0; font-size: 24px;">Liên Hệ Taxi 123 Go Ngay</h3>
<p style="font-size: 18px; margin: 10px 0;"><strong style="color: #f47e52;">Website:</strong> <a style="color: #3bbeb9; text-decoration: none; font-weight: bold;" href="https://taxi123go.vn">taxi123go.vn</a></p>
<p style="font-size: 18px; margin: 10px 0;"><strong style="color: #f47e52;">Hotline 24/7:</strong> <strong style="color: #3bbeb9; font-weight: bold;">0263.999.123</strong></p>
<p style="font-size: 18px; margin: 10px 0;"><strong style="color: #f47e52;">Địa chỉ:</strong> 18 Lê Quý Đôn, Xã Krông Ana, tỉnh Đắk Lắk</p>
<p style="font-size: 17px; color: #555; margin-top: 20px;">Hãy tải ứng dụng hoặc liên hệ với chúng tôi ngay hôm nay để trải nghiệm dịch vụ taxi thế hệ mới, an toàn, tiết kiệm và tiện lợi hơn hẳn so với việc chỉ lưu <strong style="color: #f47e52;">số điện thoại taxi Phương Đông Krông Ana</strong>.</p>

</div>
&nbsp;
###[Tôi sẽ gọi Prompt này là “PR1”]`;

const DEFAULT_PR1_TEMPLATE = DEFAULT_CONTENT_PROMPT;

const DEFAULT_KEYWORD_PROMPT = `Bạn là chuyên gia SEO Leader.Tạo { { count } } từ khóa phụ cho "{{group_key}}".

BẮT BUỘC: ONLY OUTPUT JSON ARRAY, NO TEXT BEFORE OR AFTER.

    Format:
[{ "stt": 1, "keyword": "từ khóa", "intent": "mục đích", "title": "tiêu đề SEO <60 ký tự", "url": "slug-seo", "internal_links": ["link1", "link2"] }]

Yêu cầu:
- keyword: từ khóa ngách / địa phương
    - intent: mục đích tìm kiếm
        - title: tiêu đề SEO dưới 60 ký tự
            - url: slug không dấu
                - internal_links: 3 từ khóa liên quan

CRITICAL: Respond with ONLY the JSON array, no markdown, no explanation.`;

const DEFAULT_ENRICH_PROMPT = `Bạn là chuyên gia SEO.Với danh sách từ khóa sau:
{ { group_key } }

BẮT BUỘC: Trả về JSON array thông tin cho TỪNG từ khóa trong danh sách trên.Giữ nguyên thứ tự.

Format item:
{ "stt": 1, "keyword": "từ khóa gốc", "group_key": "nhóm từ khóa", "intent": "mục đích", "title": "tiêu đề SEO", "url": "slug", "internal_links": ["link1", "link2"] }

CRITICAL: Output ONLY JSON.`;


let appState = {
    currentNode: 1,
    groupKey: '',
    groupKeys: [], // Multiple group keys from Excel/Sheets
    inputMethod: 'manual', // 'manual', 'excel', 'sheets'
    excelData: null,
    keywordsData: [],
    selectedKeywords: [],
    processedResults: [],
    isProcessing: false
};

// ============================================
// DOM Elements
// ============================================

const DOM = {
    // Nodes
    node1: document.getElementById('node1'),
    node2: document.getElementById('node2'),
    node3: document.getElementById('node3'),

    // Progress
    progressSteps: document.querySelectorAll('.progress-step'),
    progressLines: document.querySelectorAll('.progress-line'),

    // Node 1 - Input Methods
    methodTabs: document.querySelectorAll('.method-tab'),
    manualInput: document.getElementById('manualInput'),
    excelInput: document.getElementById('excelInput'),
    sheetsInput: document.getElementById('sheetsInput'),
    inputModeBadge: document.getElementById('inputModeBadge'),

    // Node 1 - Manual Input
    groupKeyInput: document.getElementById('groupKeyInput'),
    recentKeywords: document.getElementById('recentKeywords'),
    recentTags: document.getElementById('recentTags'),

    // Node 1 - Excel Upload
    uploadZone: document.getElementById('uploadZone'),
    excelFileInput: document.getElementById('excelFileInput'),
    uploadedFile: document.getElementById('uploadedFile'),
    fileName: document.getElementById('fileName'),
    removeFile: document.getElementById('removeFile'),
    excelPreview: document.getElementById('excelPreview'),
    columnSelect: document.getElementById('columnSelect'),
    previewList: document.getElementById('previewList'),

    // Node 1 - Google Sheets
    sheetsUrl: document.getElementById('sheetsUrl'),
    sheetName: document.getElementById('sheetName'),
    columnName: document.getElementById('columnName'),
    loadSheetsBtn: document.getElementById('loadSheetsBtn'),
    sheetsPreview: document.getElementById('sheetsPreview'),
    sheetsPreviewList: document.getElementById('sheetsPreviewList'),

    // Node 1 - Loaded Keywords
    loadedKeywords: document.getElementById('loadedKeywords'),
    loadedCount: document.getElementById('loadedCount'),
    loadedTags: document.getElementById('loadedTags'),
    clearLoadedBtn: document.getElementById('clearLoadedBtn'),

    // Node 1 - Custom Prompt
    keywordPrompt: document.getElementById('keywordPrompt'),
    resetKeywordPromptBtn: document.getElementById('resetKeywordPromptBtn'),

    // Node 1 - Options
    localSeoCheck: document.getElementById('localSeoCheck'),
    keywordCount: document.getElementById('keywordCount'),
    generateKeywordsBtn: document.getElementById('generateKeywordsBtn'),

    // Node 2
    currentGroupKey: document.getElementById('currentGroupKey'),
    keywordTableBody: document.getElementById('keywordTableBody'),
    keywordCountInfo: document.getElementById('keywordCountInfo'),
    selectAllKeywords: document.getElementById('selectAllKeywords'),
    headerCheckAll: document.getElementById('headerCheckAll'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    editTableBtn: document.getElementById('editTableBtn'),

    // Blog Preview
    blogPreviewModal: document.getElementById('blogPreviewModal'),
    blogContentPreview: document.getElementById('blogContentPreview'),
    closeBlogPreview: document.getElementById('closeBlogPreview'),
    copyBlogHtmlBtn: document.getElementById('copyBlogHtmlBtn'),

    // SEO Audit
    seoAuditModal: document.getElementById('seoAuditModal'),
    closeSeoAudit: document.getElementById('closeSeoAudit'),
    auditScoreBadge: document.getElementById('auditScoreBadge'),
    seoAuditDetails: document.getElementById('seoAuditDetails'),

    // SERP Preview
    serpPreviewModal: document.getElementById('serpPreviewModal'),
    closeSerpPreview: document.getElementById('closeSerpPreview'),
    serpTitleInput: document.getElementById('serpTitleInput'),
    serpDescInput: document.getElementById('serpDescInput'),
    serpUrlInput: document.getElementById('serpUrlInput'),
    serpTitlePreview: document.getElementById('serpTitlePreview'),
    serpDescPreview: document.getElementById('serpDescPreview'),
    serpUrlPreview: document.getElementById('serpUrlPreview'),
    serpTitleBar: document.getElementById('serpTitleBar'),
    serpDescBar: document.getElementById('serpDescBar'),
    serpTitleCount: document.getElementById('serpTitleCount'),
    serpDescCount: document.getElementById('serpDescCount'),
    backToNode1: document.getElementById('backToNode1'),
    processContentBtn: document.getElementById('processContentBtn'),
    contentPrompt: document.getElementById('contentPrompt'),
    resetContentPromptBtn: document.getElementById('resetContentPromptBtn'),

    // Node 3
    processingStatus: document.getElementById('processingStatus'),
    statusDetail: document.getElementById('statusDetail'),
    progressFill: document.getElementById('progressFill'),
    resultsContainer: document.getElementById('resultsContainer'),
    resultsList: document.getElementById('resultsList'),
    jsonPreview: document.getElementById('jsonPreview'),
    backToNode2: document.getElementById('backToNode2'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    exportSheetsBtn: document.getElementById('exportSheetsBtn'),

    // Settings Modal
    settingsBtn: document.getElementById('settingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettings: document.getElementById('closeSettings'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    toggleApiKey: document.getElementById('toggleApiKey'),
    modelSelect: document.getElementById('modelSelect'),
    promptTemplate: document.getElementById('promptTemplate'),
    resetPromptBtn: document.getElementById('resetPromptBtn'),
    saveSettings: document.getElementById('saveSettings'),

    // Theme
    themeToggle: document.getElementById('themeToggle'),

    // Loading & Toast
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    toastContainer: document.getElementById('toastContainer'),

    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content')
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSettings();
    initEventListeners();
    loadRecentKeywords();
    loadKeywordPrompt();
});

function initTheme() {
    const savedTheme = localStorage.getItem(APP_CONFIG.storageKeys.theme) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function initSettings() {
    // Load API Key
    const savedApiKey = localStorage.getItem(APP_CONFIG.storageKeys.apiKey) || '';
    DOM.apiKeyInput.value = savedApiKey;

    // Load Model
    const savedModel = localStorage.getItem(APP_CONFIG.storageKeys.model) || APP_CONFIG.defaultModel;
    DOM.modelSelect.value = savedModel;

    // Load Prompt Template
    const savedPrompt = localStorage.getItem(APP_CONFIG.storageKeys.promptTemplate) || DEFAULT_PR1_TEMPLATE;
    DOM.promptTemplate.value = savedPrompt;
}

function loadKeywordPrompt() {
    const savedPrompt = localStorage.getItem(APP_CONFIG.storageKeys.keywordPrompt) || DEFAULT_KEYWORD_PROMPT;
    DOM.keywordPrompt.value = savedPrompt;
}

function initEventListeners() {
    // Theme Toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Settings Modal
    DOM.settingsBtn.addEventListener('click', () => openModal(DOM.settingsModal));
    DOM.closeSettings.addEventListener('click', () => closeModal(DOM.settingsModal));
    DOM.settingsModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(DOM.settingsModal));
    DOM.toggleApiKey.addEventListener('click', togglePasswordVisibility);
    DOM.resetPromptBtn.addEventListener('click', resetPromptTemplate);
    DOM.saveSettings.addEventListener('click', saveSettings);

    // Input Method Tabs
    DOM.methodTabs.forEach(tab => {
        tab.addEventListener('click', () => switchInputMethod(tab.dataset.method));
    });

    // Node 1 - Manual Input
    DOM.generateKeywordsBtn.addEventListener('click', generateKeywords);
    DOM.groupKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateKeywords();
    });

    // Node 1 - Excel Upload
    DOM.uploadZone.addEventListener('click', () => DOM.excelFileInput.click());
    DOM.excelFileInput.addEventListener('change', handleExcelUpload);
    DOM.uploadZone.addEventListener('dragover', handleDragOver);
    DOM.uploadZone.addEventListener('dragleave', handleDragLeave);
    DOM.uploadZone.addEventListener('drop', handleDrop);
    DOM.removeFile.addEventListener('click', removeExcelFile);
    DOM.columnSelect.addEventListener('change', updateExcelPreview);

    // Node 1 - Google Sheets
    DOM.loadSheetsBtn.addEventListener('click', loadFromGoogleSheets);

    // Node 1 - Loaded Keywords
    DOM.clearLoadedBtn.addEventListener('click', clearLoadedKeywords);

    // Node 1 - Custom Prompt
    DOM.resetKeywordPromptBtn.addEventListener('click', resetKeywordPrompt);
    DOM.keywordPrompt.addEventListener('blur', saveKeywordPrompt);

    // Node 2
    DOM.backToNode1.addEventListener('click', () => navigateToNode(1));
    DOM.processContentBtn.addEventListener('click', processContent);
    DOM.exportJsonBtn.addEventListener('click', exportKeywordsJson);
    DOM.selectAllKeywords.addEventListener('change', toggleSelectAll);
    DOM.headerCheckAll.addEventListener('change', toggleSelectAll);

    // Node 3
    DOM.backToNode2.addEventListener('click', () => navigateToNode(2));
    DOM.exportCsvBtn.addEventListener('click', exportCsv);
    DOM.exportSheetsBtn.addEventListener('click', copyToClipboard);

    // Tabs
    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Blog Preview Events
    DOM.closeBlogPreview.addEventListener('click', closeBlogPreview);
    DOM.copyBlogHtmlBtn.addEventListener('click', copyBlogHtml);
    window.addEventListener('click', (e) => {
        if (e.target === DOM.blogPreviewModal) {
            closeBlogPreview();
        }
    });

    // SERP Preview Events
    DOM.closeSerpPreview.addEventListener('click', closeSerpPreview);
    window.addEventListener('click', (e) => {
        if (e.target === DOM.serpPreviewModal) {
            closeSerpPreview();
        }
    });

    DOM.serpTitleInput.addEventListener('input', updateSerpPreview);
    DOM.serpDescInput.addEventListener('input', updateSerpPreview);
    DOM.serpUrlInput.addEventListener('input', updateSerpPreview);
}

// ============================================
// Input Method Switching
// ============================================

function switchInputMethod(method) {
    appState.inputMethod = method;

    // Update tabs
    DOM.methodTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.method === method);
    });

    // Update content sections
    DOM.manualInput.classList.toggle('active', method === 'manual');
    DOM.excelInput.classList.toggle('active', method === 'excel');
    DOM.sheetsInput.classList.toggle('active', method === 'sheets');

    // Update badge
    const badges = {
        manual: 'Nhập thủ công',
        excel: 'Upload Excel',
        sheets: 'Google Sheets'
    };
    DOM.inputModeBadge.textContent = badges[method];
}

// ============================================
// Excel Upload Functions
// ============================================

function handleDragOver(e) {
    e.preventDefault();
    DOM.uploadZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    DOM.uploadZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    DOM.uploadZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processExcelFile(files[0]);
    }
}

function handleExcelUpload(e) {
    const file = e.target.files[0];
    if (file) {
        processExcelFile(file);
    }
}

async function processExcelFile(file) {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        showToast('Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV', 'error');
        return;
    }

    showLoading('Đang đọc file...');

    try {
        const data = await readExcelFile(file);
        appState.excelData = data;

        // Show file info
        DOM.uploadZone.style.display = 'none';
        DOM.uploadedFile.style.display = 'flex';
        DOM.fileName.textContent = file.name;

        // Populate column select
        if (data.headers && data.headers.length > 0) {
            DOM.columnSelect.innerHTML = data.headers.map((header, i) =>
                `< option value = "${i}" > ${header || `Cột ${i + 1}`}</option > `
            ).join('');

            DOM.excelPreview.style.display = 'block';
            updateExcelPreview();
        }

        showToast('Đã tải file thành công!', 'success');
    } catch (error) {
        console.error('Error reading Excel:', error);
        showToast('Lỗi đọc file: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target.result;

                if (file.name.endsWith('.csv')) {
                    // Parse CSV
                    const lines = content.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const rows = lines.slice(1).map(line =>
                        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
                    );
                    resolve({ headers, rows });
                } else {
                    // For Excel files, we'll use a simple approach
                    // In production, you'd use a library like SheetJS
                    showToast('Để xử lý file Excel, vui lòng convert sang CSV trước', 'warning');
                    reject(new Error('Excel files require conversion to CSV'));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Không thể đọc file'));

        if (file.name.endsWith('.csv')) {
            reader.readAsText(file, 'UTF-8');
        } else {
            reader.readAsArrayBuffer(file);
        }
    });
}

function updateExcelPreview() {
    if (!appState.excelData) return;

    const colIndex = parseInt(DOM.columnSelect.value);
    const keywords = appState.excelData.rows
        .map(row => row[colIndex])
        .filter(val => val && val.trim());

    appState.groupKeys = keywords;

    DOM.previewList.innerHTML = keywords.slice(0, 10).map(kw =>
        `< span class="preview-tag" > ${kw}</span > `
    ).join('') + (keywords.length > 10 ? `< span class="preview-tag" > +${keywords.length - 10} khác</span > ` : '');

    // Show loaded keywords
    showLoadedKeywords(keywords);
}

function removeExcelFile() {
    appState.excelData = null;
    appState.groupKeys = [];
    DOM.excelFileInput.value = '';
    DOM.uploadZone.style.display = 'block';
    DOM.uploadedFile.style.display = 'none';
    DOM.excelPreview.style.display = 'none';
    DOM.loadedKeywords.style.display = 'none';
}

// ============================================
// Google Sheets Functions
// ============================================

async function loadFromGoogleSheets() {
    const url = DOM.sheetsUrl.value.trim();

    if (!url) {
        showToast('Vui lòng nhập link Google Sheets', 'error');
        return;
    }

    // Extract sheet ID from URL
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
        showToast('Link Google Sheets không hợp lệ', 'error');
        return;
    }

    const sheetId = match[1];
    const sheetName = DOM.sheetName.value.trim() || 'Sheet1';
    const column = DOM.columnName.value.trim().toUpperCase() || 'A';

    showLoading('Đang tải dữ liệu từ Google Sheets...');

    try {
        // Use Google Sheets API (public sheets only)
        const range = `${sheetName} !${column}:${column} `;
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=AIzaSyBPQlolJLDBi0Z8s2KCUxjfL1RUl5V9mFE`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Không thể truy cập sheet. Đảm bảo sheet được chia sẻ công khai.');
        }

        const data = await response.json();

        if (!data.values || data.values.length === 0) {
            throw new Error('Không tìm thấy dữ liệu trong sheet');
        }

        // Skip header row and get keywords
        const keywords = data.values.slice(1).map(row => row[0]).filter(val => val && val.trim());

        if (keywords.length === 0) {
            throw new Error('Không tìm thấy từ khóa trong cột ' + column);
        }

        appState.groupKeys = keywords;

        // Show preview
        DOM.sheetsPreview.style.display = 'block';
        DOM.sheetsPreviewList.innerHTML = keywords.slice(0, 10).map(kw =>
            `<span class="preview-tag">${kw}</span>`
        ).join('') + (keywords.length > 10 ? `<span class="preview-tag">+${keywords.length - 10} khác</span>` : '');

        showLoadedKeywords(keywords);
        showToast(`Đã tải ${keywords.length} từ khóa từ Google Sheets!`, 'success');

    } catch (error) {
        console.error('Error loading from Sheets:', error);
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// ============================================
// Loaded Keywords Functions
// ============================================

function showLoadedKeywords(keywords) {
    if (!keywords || keywords.length === 0) {
        DOM.loadedKeywords.style.display = 'none';
        return;
    }

    DOM.loadedKeywords.style.display = 'block';
    DOM.loadedCount.textContent = keywords.length;

    DOM.loadedTags.innerHTML = keywords.map((kw, i) => `
        <span class="loaded-tag" data-index="${i}">
            ${kw}
            <button class="remove-tag" onclick="removeLoadedKeyword(${i})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </span>
    `).join('');
}

function removeLoadedKeyword(index) {
    appState.groupKeys.splice(index, 1);
    showLoadedKeywords(appState.groupKeys);
}

function clearLoadedKeywords() {
    appState.groupKeys = [];
    DOM.loadedKeywords.style.display = 'none';
    DOM.sheetsPreview.style.display = 'none';
    if (DOM.excelPreview) DOM.excelPreview.style.display = 'none';
}

// Make function globally available
window.removeLoadedKeyword = removeLoadedKeyword;

// ============================================
// Custom Keyword Prompt Functions
// ============================================

function resetKeywordPrompt() {
    DOM.keywordPrompt.value = DEFAULT_KEYWORD_PROMPT;
    localStorage.setItem(APP_CONFIG.storageKeys.keywordPrompt, DEFAULT_KEYWORD_PROMPT);
    showToast('Đã reset về prompt mặc định', 'success');
}

function saveKeywordPrompt() {
    localStorage.setItem(APP_CONFIG.storageKeys.keywordPrompt, DOM.keywordPrompt.value);
}

// ============================================
// Theme Functions
// ============================================

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(APP_CONFIG.storageKeys.theme, newTheme);
}

// ============================================
// Modal Functions
// ============================================

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function togglePasswordVisibility() {
    const input = DOM.apiKeyInput;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    DOM.toggleApiKey.classList.toggle('show', isPassword);
}

function resetPromptTemplate() {
    DOM.promptTemplate.value = DEFAULT_PR1_TEMPLATE;
    showToast('Đã reset về mẫu prompt mặc định', 'success');
}

function saveSettings() {
    localStorage.setItem(APP_CONFIG.storageKeys.apiKey, DOM.apiKeyInput.value);
    localStorage.setItem(APP_CONFIG.storageKeys.model, DOM.modelSelect.value);
    localStorage.setItem(APP_CONFIG.storageKeys.promptTemplate, DOM.promptTemplate.value);
    closeModal(DOM.settingsModal);
    showToast('Đã lưu cài đặt thành công!', 'success');
}

// ============================================
// Navigation Functions
// ============================================

function navigateToNode(nodeNumber) {
    // Update state
    appState.currentNode = nodeNumber;

    // Update active node
    [DOM.node1, DOM.node2, DOM.node3].forEach((node, i) => {
        node.classList.toggle('active', i + 1 === nodeNumber);
    });

    // Update progress
    DOM.progressSteps.forEach((step, i) => {
        step.classList.remove('active', 'completed');
        if (i + 1 === nodeNumber) {
            step.classList.add('active');
        } else if (i + 1 < nodeNumber) {
            step.classList.add('completed');
        }
    });

    DOM.progressLines.forEach((line, i) => {
        line.classList.toggle('filled', i + 1 < nodeNumber);
    });
}

// ============================================
// Recent Keywords
// ============================================

function loadRecentKeywords() {
    const recent = JSON.parse(localStorage.getItem(APP_CONFIG.storageKeys.recentKeywords) || '[]');
    if (recent.length > 0) {
        DOM.recentKeywords.classList.add('visible');
        DOM.recentTags.innerHTML = recent.slice(0, 5).map(kw =>
            `<span class="recent-tag" onclick="useRecentKeyword('${kw}')">${kw}</span>`
        ).join('');
    }
}

function saveRecentKeyword(keyword) {
    let recent = JSON.parse(localStorage.getItem(APP_CONFIG.storageKeys.recentKeywords) || '[]');
    recent = [keyword, ...recent.filter(k => k !== keyword)].slice(0, 10);
    localStorage.setItem(APP_CONFIG.storageKeys.recentKeywords, JSON.stringify(recent));
    loadRecentKeywords();
}

function useRecentKeyword(keyword) {
    DOM.groupKeyInput.value = keyword;
    DOM.groupKeyInput.focus();
}

// Make function globally available
window.useRecentKeyword = useRecentKeyword;

// ============================================
// Node 1: Generate Keywords
// ============================================

async function generateKeywords() {
    // Get group key(s) based on input method
    let groupKeys = [];
    let isListMode = false;

    if (appState.inputMethod === 'manual') {
        const manualKey = DOM.groupKeyInput.value.trim();
        if (!manualKey) {
            showToast('Vui lòng nhập từ khóa chính!', 'error');
            DOM.groupKeyInput.focus();
            return;
        }
        groupKeys = [manualKey];
    } else {
        if (appState.groupKeys.length === 0) {
            showToast('Vui lòng tải dữ liệu trước!', 'error');
            return;
        }
        groupKeys = appState.groupKeys;
        isListMode = true; // Flag to indicate we process this list directly
    }

    const apiKey = localStorage.getItem(APP_CONFIG.storageKeys.apiKey);
    const keywordCount = parseInt(DOM.keywordCount.value) || 20;
    const isLocalSeo = DOM.localSeoCheck.checked;
    const customPrompt = DOM.keywordPrompt.value.trim();

    // Save for display
    appState.groupKey = isListMode ? `File (${groupKeys.length} từ khóa)` : groupKeys[0];
    if (!isListMode && groupKeys.length === 1) {
        saveRecentKeyword(groupKeys[0]);
    }

    showLoading(isListMode ? `Đang phân tích ${groupKeys.length} từ khóa...` : 'Đang tạo từ khóa...');

    try {
        let allKeywordsData = [];

        if (isListMode && apiKey) {
            // Process uploaded list (Enrichment Mode)
            const chunkSize = 20;
            for (let i = 0; i < groupKeys.length; i += chunkSize) {
                const chunk = groupKeys.slice(i, i + chunkSize);
                DOM.loadingText.textContent = `Đang xử lý ${i + 1}-${Math.min(i + chunkSize, groupKeys.length)}/${groupKeys.length}...`;

                try {
                    const chunkData = await enrichKeywordsList(chunk, apiKey);
                    allKeywordsData = allKeywordsData.concat(chunkData);
                } catch (err) {
                    console.error('Error enriching chunk:', err);
                    // Fallback for failed chunk
                    allKeywordsData = allKeywordsData.concat(chunk.map(k => ({
                        stt: 0,
                        keyword: k,
                        intent: 'Error analyzing',
                        title: k,
                        url: '',
                        internal_links: []
                    })));
                }
            }
        }
        else if (isListMode && !apiKey) {
            // Demo mode for list
            allKeywordsData = groupKeys.map((k, i) => ({
                stt: i + 1,
                keyword: k,
                intent: 'Demo Intent',
                title: `Demo Title for ${k}`,
                url: k.toLowerCase().replace(/ /g, '-'),
                internal_links: ['demo 1', 'demo 2'],
                groupKey: 'File Upload'
            }));
            showToast('Đang dùng chế độ demo. Thêm API Key để phân tích thật.', 'warning');
        }
        else {
            // Manual Mode (Generation Mode) -> Use existing logic
            const groupKey = groupKeys[0];
            let keywordsData;

            if (apiKey) {
                keywordsData = await generateKeywordsWithAI(groupKey, keywordCount, isLocalSeo, apiKey, customPrompt);
            } else {
                keywordsData = generateSampleKeywords(groupKey, keywordCount, isLocalSeo);
            }

            allKeywordsData = keywordsData.map(kw => ({ ...kw, groupKey, group_key: kw.group_key || groupKey }));
        }

        appState.keywordsData = allKeywordsData;
        renderKeywordTable(allKeywordsData);
        navigateToNode(2);
        DOM.currentGroupKey.textContent = appState.groupKey;

    } catch (error) {
        console.error('Error generating keywords:', error);
        showToast('Lỗi: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function enrichKeywordsList(keywordsList, apiKey) {
    const model = localStorage.getItem(APP_CONFIG.storageKeys.model) || APP_CONFIG.defaultModel;
    const keywordsStr = keywordsList.join('\n');
    const prompt = DEFAULT_ENRICH_PROMPT.replace('{{group_key}}', keywordsStr);

    const response = await fetch(`${APP_CONFIG.apiEndpoint}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json'
            }
        })
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse JSON
    let jsonStr = text.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
    if (!jsonStr.startsWith('[')) {
        const start = jsonStr.indexOf('[');
        const end = jsonStr.lastIndexOf(']');
        if (start !== -1 && end !== -1) jsonStr = jsonStr.substring(start, end + 1);
    }

    return JSON.parse(jsonStr);
}

async function generateKeywordsWithAI(groupKey, count, isLocalSeo, apiKey, customPrompt) {
    const model = localStorage.getItem(APP_CONFIG.storageKeys.model) || APP_CONFIG.defaultModel;

    // Use custom prompt with variable replacement
    let prompt = customPrompt || DEFAULT_KEYWORD_PROMPT;

    // Auto-inject context if placeholders are missing in custom prompt
    if (customPrompt && !prompt.includes('{{group_key}}')) {
        prompt = `[CONTEXT: TỪ KHÓA CHÍNH LÀ "${groupKey}"]\n${prompt}`;
    }

    prompt = prompt
        .replace(/\{\{group_key\}\}/g, groupKey)
        .replace(/\{\{count\}\}/g, count)
        .replace(/\{\{local_seo\}\}/g, isLocalSeo ? 'Có' : 'Không');

    // Force formatting if custom prompt is used
    if (customPrompt) {
        prompt += `\n\nCRITICAL SYSTEM INSTRUCTION: 
        Regardless of the prompt above asking for a TABLE, you MUST output a JSON Array of objects.
        Map your generated content to this structure for each item:
        {
            "keyword": "Content from Column 1 (Main Keyword)",
            "group_key": "Content from Column 2 (Group Keyword)",
            "intent": "Content from Column 3 (Search Intent)",
            "title": "Content from Column 4 (SEO Title)",
            "url": "Content from Column 5 (URL)",
            "internal_links": [] 
        }
        Do not output Markdown tables. Output ONLY valid JSON array.`;
    }

    const response = await fetch(`${APP_CONFIG.apiEndpoint}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json'
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse JSON
    let jsonStr = text.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();

    // Handle array brackets
    if (!jsonStr.startsWith('[')) {
        const start = jsonStr.indexOf('[');
        const end = jsonStr.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            jsonStr = jsonStr.substring(start, end + 1);
        } else if (jsonStr.startsWith('{')) {
            jsonStr = `[${jsonStr}]`;
        }
    }

    try {
        const parsedData = JSON.parse(jsonStr);

        // Robust data normalization
        let finalData = [];
        if (Array.isArray(parsedData)) {
            finalData = parsedData;
        } else if (typeof parsedData === 'object' && parsedData !== null) {
            const values = Object.values(parsedData);
            const arrayValue = values.find(v => Array.isArray(v));
            if (arrayValue) {
                finalData = arrayValue;
            } else {
                finalData = [parsedData];
            }
        } else {
            throw new Error('Response is not an array or object');
        }

        // Filter out nulls and map missing fields
        return finalData.filter(item => item !== null).map((item, index) => ({
            stt: item.stt || index + 1,
            keyword: item.keyword || item.Col1 || item.col1 || 'N/A',
            group_key: item.group_key || item.Col2 || item.col2 || '',
            intent: item.intent || item.Col3 || item.col3 || '',
            title: item.title || item.Col4 || item.col4 || '',
            url: item.url || item.Col5 || item.col5 || '',
            internal_links: item.internal_links || []
        }));

    } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Content:', jsonStr.substring(0, 500));
        throw new Error('AI không trả về đúng định dạng JSON. Hãy thử lại hoặc dùng prompt mặc định.');
    }
}



function generateSampleKeywords(groupKey, count, isLocalSeo) {
    const baseKeywords = [
        { suffix: 'giá rẻ', intent: 'Tìm dịch vụ giá tốt', titlePrefix: 'Top' },
        { suffix: 'uy tín', intent: 'Tìm dịch vụ chất lượng', titlePrefix: '' },
        { suffix: 'đi sân bay', intent: 'Đặt xe đi sân bay', titlePrefix: 'Dịch vụ' },
        { suffix: '24/7', intent: 'Tìm dịch vụ hoạt động liên tục', titlePrefix: '' },
        { suffix: 'liên tỉnh', intent: 'Đặt xe đi xa', titlePrefix: '' },
        { suffix: 'nhóm', intent: 'Tìm xe đi chung', titlePrefix: '' },
        { suffix: 'số điện thoại', intent: 'Tìm số hotline', titlePrefix: 'SĐT' },
        { suffix: 'bảng giá', intent: 'Tham khảo giá dịch vụ', titlePrefix: 'Bảng giá' },
        { suffix: 'đưa đón', intent: 'Đặt xe đưa đón', titlePrefix: 'Dịch vụ' },
        { suffix: 'booking', intent: 'Đặt xe online', titlePrefix: 'Đặt xe' },
        { suffix: 'gần đây', intent: 'Tìm dịch vụ gần vị trí', titlePrefix: '' },
        { suffix: 'nhanh', intent: 'Tìm dịch vụ gấp', titlePrefix: '' },
        { suffix: 'tốt nhất', intent: 'So sánh dịch vụ', titlePrefix: 'Top' },
        { suffix: 'review', intent: 'Đọc đánh giá', titlePrefix: 'Review' },
        { suffix: 'khuyến mãi', intent: 'Tìm ưu đãi giảm giá', titlePrefix: '' },
        { suffix: 'app', intent: 'Tải ứng dụng đặt xe', titlePrefix: 'App' },
        { suffix: 'hợp đồng', intent: 'Thuê xe dài hạn', titlePrefix: '' },
        { suffix: 'VIP', intent: 'Đặt xe cao cấp', titlePrefix: '' },
        { suffix: 'tiết kiệm', intent: 'Tìm giải pháp tiết kiệm', titlePrefix: 'Mẹo' },
        { suffix: 'an toàn', intent: 'Tìm dịch vụ đáng tin cậy', titlePrefix: '' },
    ];

    const removeVietnameseTones = (str) => {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };

    return baseKeywords.slice(0, count).map((item, index) => {
        const keyword = `${groupKey} ${item.suffix}`;
        const title = item.titlePrefix
            ? `${item.titlePrefix} ${groupKey} ${item.suffix} - Uy Tín #1`
            : `${groupKey} ${item.suffix} - Giá Tốt Nhất 2024`;

        return {
            stt: index + 1,
            keyword: keyword,
            group_key: groupKey,
            intent: item.intent,
            title: title.substring(0, 60),
            url: removeVietnameseTones(keyword),
            internal_links: [
                groupKey,
                `${groupKey} giá rẻ`,
                `${groupKey} uy tín`
            ]
        };
    });
}

// Helper to generate content prompt for a row
function generateRowPrompt(item) {
    let prompt = DEFAULT_CONTENT_PROMPT;
    prompt = prompt.replace(/\${title}/g, item.title || '')
        .replace(/\${keywords}/g, item.keyword || '')
        .replace(/\${intent}/g, item.intent || '')
        .replace(/\${internalKey}/g, Array.isArray(item.internal_links) ? item.internal_links.join(', ') : (item.internal_links || ''))
        .replace(/\${groupKey}/g, item.group_key || '');
    return prompt;
}

function copyRowPrompt(index) {
    const item = appState.keywordsData[index];
    if (!item) return;
    const prompt = generateRowPrompt(item);
    navigator.clipboard.writeText(prompt).then(() => {
        showToast('Đã copy Prompt AI!', 'success');
    }).catch(err => {
        console.error('Copy failed', err);
        showToast('Lỗi copy', 'error');
    });
}
window.copyRowPrompt = copyRowPrompt;

// ============================================
// Node 2: Keyword Table
// ============================================

function renderKeywordTable(data) {
    DOM.keywordTableBody.innerHTML = data.map((item, index) => `
        <tr data-index="${index}">
            <td class="col-check">
                <input type="checkbox" class="keyword-checkbox" data-index="${index}" checked>
            </td>
            <td class="col-stt">${item.stt}</td>
            <td class="col-keyword">${item.keyword}</td>
            <td class="col-group">${item.group_key || ''}</td>
            <td class="col-prompt">
                <div class="action-buttons">
                    <button class="btn-copy-prompt" onclick="copyRowPrompt(${index})" title="Copy Prompt AI">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button class="btn-google-preview" onclick="viewSerpPreview(${index}, 'keyword')" title="Google Search Preview">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>
            </td>
            <td class="col-intent">${item.intent}</td>
            <td class="col-title">${item.title}</td>
            <td class="col-url">${item.url}</td>
            <td class="col-links">
                ${item.internal_links.map(link => `<span class="link-tag">${link}</span>`).join('')}
            </td>
        </tr>
    `).join('');

    DOM.keywordCountInfo.textContent = `${data.length} từ khóa`;

    // Add checkbox listeners
    document.querySelectorAll('.keyword-checkbox').forEach(cb => {
        cb.addEventListener('change', updateSelectedKeywords);
    });

    updateSelectedKeywords();
}

function toggleSelectAll(e) {
    const isChecked = e.target.checked;
    document.querySelectorAll('.keyword-checkbox').forEach(cb => {
        cb.checked = isChecked;
    });
    DOM.selectAllKeywords.checked = isChecked;
    DOM.headerCheckAll.checked = isChecked;
    updateSelectedKeywords();
}

function updateSelectedKeywords() {
    const checkboxes = document.querySelectorAll('.keyword-checkbox:checked');
    appState.selectedKeywords = Array.from(checkboxes).map(cb =>
        appState.keywordsData[parseInt(cb.dataset.index)]
    );

    const allChecked = document.querySelectorAll('.keyword-checkbox').length === checkboxes.length;
    DOM.selectAllKeywords.checked = allChecked;
    DOM.headerCheckAll.checked = allChecked;
}

function exportKeywordsJson() {
    const dataToExport = appState.keywordsData.map(item => ({
        ...item,
        content_prompt: generateRowPrompt(item)
    }));
    const dataStr = JSON.stringify(dataToExport, null, 2);
    downloadFile(dataStr, `keywords-${appState.groupKey}.json`, 'application/json');
    showToast('Đã tải xuống file JSON!', 'success');
}

// ============================================
// Node 3: Content Processing
// ============================================

async function processContent() {
    if (appState.selectedKeywords.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 từ khóa!', 'error');
        return;
    }

    navigateToNode(3);
    appState.isProcessing = true;
    appState.processedResults = [];

    DOM.processingStatus.style.display = 'block';
    DOM.resultsContainer.classList.remove('visible');

    const apiKey = localStorage.getItem(APP_CONFIG.storageKeys.apiKey);
    const template = localStorage.getItem(APP_CONFIG.storageKeys.promptTemplate) || DEFAULT_PR1_TEMPLATE;

    const total = appState.selectedKeywords.length;

    for (let i = 0; i < total; i++) {
        const keyword = appState.selectedKeywords[i];
        DOM.statusDetail.textContent = `${i + 1}/${total} - ${keyword.keyword}`;
        DOM.progressFill.style.width = `${((i + 1) / total) * 100}%`;

        try {
            let content;

            if (apiKey) {
                content = await processKeywordWithAI(keyword, template, apiKey);
            } else {
                // Demo mode
                content = generateSampleContent(keyword);
                await delay(500); // Simulate processing
            }

            // Calculate SEO Score
            const seoAnalysis = calculateSeoScore(content, keyword.keyword);

            appState.processedResults.push({
                ...keyword,
                content: content,
                seoAnalysis: seoAnalysis
            });

        } catch (error) {
            console.error(`Error processing ${keyword.keyword}:`, error);
            appState.processedResults.push({
                ...keyword,
                content: `Lỗi: ${error.message}`,
                error: true
            });
        }
    }

    appState.isProcessing = false;
    DOM.processingStatus.style.display = 'none';
    displayResults();

    if (!apiKey) {
        showToast('Đang dùng nội dung mẫu. Thêm API Key để sử dụng AI thực.', 'warning');
    }
}

async function processKeywordWithAI(keyword, template, apiKey) {
    const model = localStorage.getItem(APP_CONFIG.storageKeys.model) || APP_CONFIG.defaultModel;

    const prompt = template
        .replace(/(\{\{keyword\}\}|\$\{keyword\}|\$\{keywords\})/g, keyword.keyword)
        .replace(/(\{\{title\}\}|\$\{title\})/g, keyword.title)
        .replace(/(\{\{url\}\}|\$\{url\})/g, keyword.url)
        .replace(/(\{\{intent\}\}|\$\{intent\})/g, keyword.intent)
        .replace(/(\{\{group_key\}\}|\$\{group_key\}|\$\{groupKey\})/g, keyword.group_key || '')
        .replace(/(\{\{internal_links\}\}|\$\{internal_links\}|\$\{internalKey\})/g, keyword.internal_links.join(', '));

    const response = await fetch(`${APP_CONFIG.apiEndpoint}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function generateSampleContent(keyword) {
    return `# ${keyword.title}

## Meta Description
${keyword.keyword} - Dịch vụ uy tín, giá tốt nhất, phục vụ 24/7. Đặt ngay để nhận ưu đãi hấp dẫn!

## Nội dung bài viết

### Giới thiệu
Bạn đang tìm kiếm ${keyword.keyword}? Đây là bài viết chi tiết giúp bạn tìm được dịch vụ phù hợp nhất...

### Tại sao nên chọn dịch vụ của chúng tôi?
- Giá cả cạnh tranh
- Dịch vụ chuyên nghiệp
- Phục vụ 24/7

### Bảng giá tham khảo
| Loại dịch vụ | Giá từ |
|--------------|--------|
| Trong thành phố | 50,000đ |
| Liên tỉnh | 150,000đ |

### Liên hệ đặt xe ngay
Hotline: 1900-xxxx

---
*Từ khóa liên quan: ${keyword.internal_links.join(', ')}*`;
}

function displayResults() {
    DOM.resultsList.innerHTML = '';

    if (appState.processedResults.length === 0) {
        DOM.resultsContainer.classList.remove('visible');
        return;
    }

    DOM.resultsContainer.classList.add('visible');

    appState.processedResults.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `result-item ${item.error ? 'error' : ''}`;

        // Clean and parse markdown
        let content = item.content || '';
        // Remove markdown code blocks wrapper if present
        const codeBlockMatch = content.match(/```(?:markdown|html)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) content = codeBlockMatch[1];

        // Use marked to render HTML
        let renderedHtml = '';
        try {
            renderedHtml = marked.parse(content);
        } catch (e) {
            renderedHtml = content.replace(/\n/g, '<br>');
        }

        div.innerHTML = `
            <div class="result-header">
                <div class="header-left">
                    <h4>${index + 1}. ${item.keyword}</h4>
                    ${item.seoAnalysis ? getScoreBadgeHtml(item.seoAnalysis.score, index) : ''}
                </div>
                <div class="result-actions">
                     <button class="btn-icon-text" onclick="copyResultHtml(${index})" title="Copy HTML Code">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy HTML Code
                    </button>
                    <button class="btn-icon-text" onclick="viewBlogPreview(${index})" title="View Blog Mode">
                       <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                       View Blog
                   </button>
                    <button class="btn-icon-text" onclick="viewSerpPreview(${index}, 'content')" title="Google SERP Preview">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Google Preview
                    </button>
                </div>
            </div>
            
            <div class="article-preview">
                ${renderedHtml}
            </div>
        `;
        DOM.resultsList.appendChild(div);
    });

    // Render JSON
    DOM.jsonPreview.textContent = JSON.stringify(appState.processedResults, null, 2);
}

// Global function for copy html
window.copyResultHtml = function (index) {
    const item = appState.processedResults[index];
    if (!item) return;

    let content = item.content || '';
    const codeBlockMatch = content.match(/```(?:markdown|html)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) content = codeBlockMatch[1];

    navigator.clipboard.writeText(content).then(() => {
        showToast('Đã copy mã HTML!', 'success');
    }).catch(err => {
        showToast('Lỗi copy', 'error');
    });
};

// ============================================
// Blog Preview Functions
// ============================================

window.viewBlogPreview = function (index) {
    const item = appState.processedResults[index];
    if (!item) return;

    let content = item.content || '';
    // Remove markdown code blocks wrapper if present
    const codeBlockMatch = content.match(/```(?:markdown|html)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) content = codeBlockMatch[1];

    // Use marked to render HTML if it's markdown, or use as is
    // Since the prompt asks for HTML output, it might be raw HTML
    // We try to parse it if it looks like markdown, otherwise use as is
    // But since the new prompt output is HTML code, we should just use it

    // However, existing logic uses marked.parse. Let's stick to what displayResults does
    let renderedHtml = '';
    try {
        renderedHtml = marked.parse(content);
    } catch (e) {
        renderedHtml = content;
    }

    DOM.blogContentPreview.innerHTML = renderedHtml;
    DOM.blogPreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

function closeBlogPreview() {
    DOM.blogPreviewModal.classList.remove('active');
    document.body.style.overflow = '';
}

function copyBlogHtml() {
    const content = DOM.blogContentPreview.innerHTML;
    navigator.clipboard.writeText(content).then(() => {
        showToast('Đã copy nội dung HTML!', 'success');
    }).catch(err => {
        showToast('Lỗi copy', 'error');
    });
}

// ============================================
// Google SERP Preview Functions
// ============================================

window.viewSerpPreview = function (index, source = 'content') {
    let item;

    if (source === 'keyword') {
        item = appState.keywordsData[index];
    } else {
        item = appState.processedResults[index];
    }

    if (!item) return;

    // 1. Extract Data
    let title = item.title || '';
    let desc = '';
    let url = item.url || '';

    if (source === 'keyword') {
        // For Keyword Planner, use Intent as Description
        desc = item.intent || '';
    } else {
        // For Content Results, extract from content
        const content = item.content || '';

        // Extract Title from H1 if empty
        if (!title) {
            const h1Match = content.match(/^#\s+(.+)$/m) || content.match(/<h1>(.*?)<\/h1>/);
            if (h1Match) title = h1Match[1];
        }

        // Extract Description from first paragraph if empty
        if (!desc) {
            if (item.intent) {
                desc = item.intent;
            } else {
                // rough heuristic: first paragraph that is not a heading
                const doc = new DOMParser().parseFromString(marked.parse(content), 'text/html');
                const firstP = doc.querySelector('p');
                if (firstP) desc = firstP.textContent.substring(0, 160);
            }
        }
    }

    // 2. Populate Inputs
    DOM.serpTitleInput.value = title;
    DOM.serpDescInput.value = desc;
    DOM.serpUrlInput.value = url;

    // 3. Update Preview
    updateSerpPreview();

    // 4. Show Modal
    DOM.serpPreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function closeSerpPreview() {
    DOM.serpPreviewModal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateSerpPreview() {
    const title = DOM.serpTitleInput.value;
    const desc = DOM.serpDescInput.value;
    const url = DOM.serpUrlInput.value;

    // Update Text
    DOM.serpTitlePreview.textContent = title || 'Tiêu đề bài viết sẽ hiện ở đây';
    DOM.serpDescPreview.textContent = desc || 'Mô tả bài viết sẽ hiện ở đây...';
    DOM.serpUrlPreview.textContent = url || 'bai-viet';

    const titleWidth = getTextWidth(title, '20px Arial');
    const descWidth = getTextWidth(desc, '14px Arial');

    const titleMax = 580;
    const descMax = 920;

    const titlePercent = Math.min((titleWidth / titleMax) * 100, 100);
    const descPercent = Math.min((descWidth / descMax) * 100, 100);

    DOM.serpTitleBar.style.width = `${titlePercent}%`;
    DOM.serpDescBar.style.width = `${descPercent}%`;

    DOM.serpTitleCount.textContent = `${Math.round(titleWidth)}px / ${titleMax}px`;
    DOM.serpDescCount.textContent = `${Math.round(descWidth)}px / ${descMax}px`;

    // Colors
    DOM.serpTitleBar.className = 'progress-bar';
    if (titleWidth > titleMax) DOM.serpTitleBar.classList.add('error');
    else if (titleWidth > titleMax * 0.9) DOM.serpTitleBar.classList.add('warning');

    DOM.serpDescBar.className = 'progress-bar';
    if (descWidth > descMax) DOM.serpDescBar.classList.add('error');
    else if (descWidth > descMax * 0.9) DOM.serpDescBar.classList.add('warning');
}

function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

// ============================================
// SEO Audit Functions
// ============================================

function calculateSeoScore(content, keyword) {
    if (!content || !keyword) return { score: 0, details: [] };

    let score = 100;
    const details = [];
    const lowerContent = content.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();

    // 1. Keyword in Title (H1) - 20 points
    const h1Match = content.match(/^#\s+(.+)$/m) || content.match(/<h1>(.*?)<\/h1>/);
    const h1Title = h1Match ? h1Match[1].toLowerCase() : '';
    const hasKeywordInH1 = h1Title.includes(lowerKeyword);

    if (hasKeywordInH1) {
        details.push({ criterion: 'Từ khóa trong H1', status: 'pass', message: 'Có xuất hiện trong tiêu đề H1' });
    } else {
        score -= 20;
        details.push({ criterion: 'Từ khóa trong H1', status: 'fail', message: 'Không tìm thấy từ khóa trong H1' });
    }

    // 2. Keyword in Intro (First Paragraph) - 20 points
    const firstParaMatch = content.match(/^(?!#)(.+)$/m); // Simple check
    const firstPara = firstParaMatch ? firstParaMatch[1].toLowerCase() : '';
    const hasKeywordInIntro = firstPara.includes(lowerKeyword);

    if (hasKeywordInIntro) {
        details.push({ criterion: 'Từ khóa trong mở bài', status: 'pass', message: 'Có xuất hiện trong đoạn mở đầu' });
    } else {
        score -= 10; // Less critical than H1
        details.push({ criterion: 'Từ khóa trong mở bài', status: 'warning', message: 'Nên có từ khóa trong 100 từ đầu tiên' });
    }

    // 3. Keyword Density - 30 points
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (lowerContent.match(new RegExp(lowerKeyword, 'g')) || []).length;
    const density = (keywordCount / wordCount) * 100;

    if (density >= 0.5 && density <= 2.5) {
        details.push({ criterion: 'Mật độ từ khóa', status: 'pass', message: `Mật độ tốt: ${density.toFixed(2)}% (${keywordCount} lần)` });
    } else if (density > 2.5) {
        score -= 10;
        details.push({ criterion: 'Mật độ từ khóa', status: 'warning', message: `Mật độ hơi cao: ${density.toFixed(2)}% (Keyword Stuffing?)` });
    } else {
        score -= 10;
        details.push({ criterion: 'Mật độ từ khóa', status: 'warning', message: `Mật độ hơi thấp: ${density.toFixed(2)}%` });
    }

    // 4. Content Length - 20 points
    if (wordCount >= 1000) {
        details.push({ criterion: 'Độ dài bài viết', status: 'pass', message: `Đạt chuẩn: ${wordCount} từ` });
    } else if (wordCount >= 600) {
        score -= 5;
        details.push({ criterion: 'Độ dài bài viết', status: 'warning', message: `Khá: ${wordCount} từ (Nên > 1000)` });
    } else {
        score -= 20;
        details.push({ criterion: 'Độ dài bài viết', status: 'fail', message: `Quá ngắn: ${wordCount} từ` });
    }

    // 5. Keyword in Subheadings (H2, H3) - 10 points
    const h2Matches = content.match(/^##\s+(.+)$/gm) || [];
    const hasKeywordInH2 = h2Matches.some(h2 => h2.toLowerCase().includes(lowerKeyword));

    if (hasKeywordInH2) {
        details.push({ criterion: 'Từ khóa trong H2', status: 'pass', message: 'Có xuất hiện trong thẻ H2' });
    } else {
        score -= 10;
        details.push({ criterion: 'Từ khóa trong H2', status: 'warning', message: 'Nên có từ khóa trong ít nhất một thẻ H2' });
    }

    return { score: Math.max(0, score), details };
}

function getScoreBadgeHtml(score, index) {
    let colorClass = 'success';
    if (score < 50) colorClass = 'error';
    else if (score < 80) colorClass = 'warning';

    return `<div class="score-badge ${colorClass}" onclick="viewSeoAudit(${index})" title="Xem chi tiết Audit">SEO Code: ${score}/100</div>`;
}

window.viewSeoAudit = function (index) {
    const item = appState.processedResults[index];
    if (!item || !item.seoAnalysis) return;

    const { score, details } = item.seoAnalysis;

    // Update Badge
    DOM.auditScoreBadge.textContent = `${score}/100`;
    DOM.auditScoreBadge.className = 'score-badge-large';
    if (score < 50) DOM.auditScoreBadge.classList.add('error');
    else if (score < 80) DOM.auditScoreBadge.classList.add('warning');
    else DOM.auditScoreBadge.classList.add('success');

    // Update Details
    DOM.seoAuditDetails.innerHTML = details.map(detail => `
        <div class="audit-item ${detail.status}">
            <div class="audit-icon">
                ${getAuditIcon(detail.status)}
            </div>
            <div class="audit-info">
                <h4>${detail.criterion}</h4>
                <p>${detail.message}</p>
            </div>
        </div>
    `).join('');

    DOM.seoAuditModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSeoAudit() {
    DOM.seoAuditModal.classList.remove('active');
    document.body.style.overflow = '';
}

function getAuditIcon(status) {
    if (status === 'pass') {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (status === 'warning') {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
}

function switchTab(tabName) {
    DOM.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.getElementById('previewTab').classList.toggle('active', tabName === 'preview');
    document.getElementById('jsonTab').classList.toggle('active', tabName === 'json');
}

// ============================================
// Export Functions
// ============================================

function exportCsv() {
    const headers = ['STT', 'Keyword', 'Intent', 'Title', 'URL', 'Internal Links', 'Content'];
    const rows = appState.processedResults.map(item => [
        item.stt,
        item.keyword,
        item.intent,
        item.title,
        item.url,
        item.internal_links.join('; '),
        item.content.replace(/"/g, '""')
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Add BOM for UTF-8
    const bom = '\uFEFF';
    downloadFile(bom + csvContent, `seo-content-${appState.groupKey}.csv`, 'text/csv;charset=utf-8');
    showToast('Đã tải xuống file CSV!', 'success');
}

function copyToClipboard() {
    const headers = ['STT', 'Keyword', 'Intent', 'Title', 'URL', 'Internal Links', 'Content'];
    const rows = appState.processedResults.map(item => [
        item.stt,
        item.keyword,
        item.intent,
        item.title,
        item.url,
        item.internal_links.join('; '),
        item.content
    ]);

    const tsvContent = [
        headers.join('\t'),
        ...rows.map(row => row.join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(tsvContent).then(() => {
        showToast('Đã copy! Paste vào Google Sheets (Ctrl+V)', 'success');
    }).catch(() => {
        showToast('Không thể copy. Vui lòng dùng Export CSV.', 'error');
    });
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// Utility Functions
// ============================================

function showLoading(text = 'Đang xử lý...') {
    DOM.loadingText.textContent = text;
    DOM.loadingOverlay.classList.add('active');
}

function hideLoading() {
    DOM.loadingOverlay.classList.remove('active');
}

function showToast(message, type = 'info') {
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <span class="toast-message">${message}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// Initialization Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load Saved Settings
    const savedKey = localStorage.getItem(APP_CONFIG.storageKeys.apiKey);
    if (savedKey && DOM.apiKeyInput) DOM.apiKeyInput.value = savedKey;

    const savedModel = localStorage.getItem(APP_CONFIG.storageKeys.model);
    if (savedModel && DOM.modelSelect) {
        // Validate if saved model exists in current options
        const optionExists = Array.from(DOM.modelSelect.options).some(opt => opt.value === savedModel);
        if (optionExists) {
            DOM.modelSelect.value = savedModel;
        } else {
            console.warn(`Saved model ${savedModel} not found, using default.`);
            DOM.modelSelect.value = APP_CONFIG.defaultModel;
        }
    }

    // Check prompt template
    const savedPrompt = localStorage.getItem(APP_CONFIG.storageKeys.promptTemplate);
    if (savedPrompt && DOM.promptTemplate) {
        DOM.promptTemplate.value = savedPrompt;
    } else if (DOM.promptTemplate) {
        DOM.promptTemplate.value = DEFAULT_PR1_TEMPLATE;
    }

    // Load recent keywords
    if (typeof loadRecentKeywords === 'function') loadRecentKeywords();

    // Initialize Settings Save Button
    const saveBtn = document.getElementById('saveSettings');
    if (saveBtn) {
        saveBtn.removeEventListener('click', saveSettings); // Ensure no duplicates if re-run
        saveBtn.addEventListener('click', saveSettings);
    }
});
