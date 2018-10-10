<html>
	<head>
		<meta content='initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width' name='viewport' />
		<link rel="stylesheet" href="style.css">
		<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>		
	</head>
	<body>
		<header>
			<h1>Business Scan</h1>
			<!-- <div id="top-bar">
				<div class="left-side">
					<h2>SCAN APP</h2>
				</div>
				<div class="right-side">
					<img src="img/menu-button-of-three-horizontal-lines.png" class="menuBariCon" />
				</div>
			</div> -->
		</header>
		<div class="content-center">
			<content>
        		<!-- <input type="number" id="recordToLoad"> <button id="testImageBtn">Test</button> -->
				<textarea id="content"></textarea>
				<img style="display:none;width:100px;height:60px;" id="myImage" src="" />
				<table id="dataCotent">
		            <thead>
		                <tr>
		                    <td>Card Image</td>
		                    <td>Content</td>
		                    <td>Action</td>
		                </tr>
		            </thead>
		            <tbody>
		                
		            </tbody>
		        </table>
				<form id="contact-form">
					<input type="text" name="enteredContent[]" class="createConatact_Content Tfirst" />
					<select class="createConatact_field Sfirst" name="selectedFields[]">
						<option value="" >Select Type</option>
						<option value="displayName" >Full Name</option>
						<option value="phone" >Phone</option>
						<option value="email" >Email Address</option>
						<option value="address" >Address</option>
						<option value="twitter" >Twitter</option>
						<option value="facebook" >Facebook</option>
						<option value="linkedin" >Linkedin</option>
						<option value="wechat" >WeChat</option>
						<option value="telegram" >Telegram</option>
						<option value="others" >Others</option>
					</select>
					<br/><br/>
					<input type="text" name="enteredContent[]" class="createConatact_Content Tsecond" />
					<select class="createConatact_field Ssecond" name="selectedFields[]">
						<option value="" >Select Type</option>
						<option value="displayName" >Full Name</option>
						<option value="phone" >Phone</option>
						<option value="email" >Email Address</option>
						<option value="address" >Address</option>
						<option value="twitter" >Twitter</option>
						<option value="facebook" >Facebook</option>
						<option value="linkedin" >Linkedin</option>
						<option value="wechat" >WeChat</option>
						<option value="telegram" >Telegram</option>
						<option value="others" >Others</option>
					</select>
					<br/><br/>
					<input type="text" name="enteredContent[]" class="createConatact_Content Tthird" />
					<select class="createConatact_field Sthird" name="selectedFields[]">
						<option value="" >Select Type</option>
						<option value="displayName" >Full Name</option>
						<option value="phone" >Phone</option>
						<option value="email" >Email Address</option>
						<option value="address" >Address</option>
						<option value="twitter" >Twitter</option>
						<option value="facebook" >Facebook</option>
						<option value="linkedin" >Linkedin</option>
						<option value="wechat" >WeChat</option>
						<option value="telegram" >Telegram</option>
						<option value="others" >Others</option>
					</select>
					<br/><br/>
					<input type="text" name="enteredContent[]" class="createConatact_Content Tforth" />
					<select class="createConatact_field Sforth" name="selectedFields[]">
						<option value="" >Select Type</option>
						<option value="displayName" >Full Name</option>
						<option value="phone" >Phone</option>
						<option value="email" >Email Address</option>
						<option value="address" >Address</option>
						<option value="twitter" >Twitter</option>
						<option value="facebook" >Facebook</option>
						<option value="linkedin" >Linkedin</option>
						<option value="wechat" >WeChat</option>
						<option value="telegram" >Telegram</option>
						<option value="others" >Others</option>
					</select>
					<br/><br/>
					<input type="text" name="enteredContent[]" class="createConatact_Content Tfifth" />
					<select class="createConatact_field Sfifth" name="selectedFields[]">
						<option value="" >Select Type</option>
						<option value="displayName" >Full Name</option>
						<option value="phone" >Phone</option>
						<option value="email" >Email Address</option>
						<option value="address" >Address</option>
						<option value="twitter" >Twitter</option>
						<option value="facebook" >Facebook</option>
						<option value="linkedin" >Linkedin</option>
						<option value="wechat" >WeChat</option>
						<option value="telegram" >Telegram</option>
						<option value="others" >Others</option>
					</select>
					<br/><br/>
					<input type="text" name="enteredContent[]" class="createConatact_Content Tsixth" />
					<select class="createConatact_field Ssixth" name="selectedFields[]">
						<option value="" >Select Type</option>
						<option value="displayName" >Full Name</option>
						<option value="phone" >Phone</option>
						<option value="email" >Email Address</option>
						<option value="address" >Address</option>
						<option value="twitter" >Twitter</option>
						<option value="facebook" >Facebook</option>
						<option value="linkedin" >Linkedin</option>
						<option value="wechat" >WeChat</option>
						<option value="telegram" >Telegram</option>
						<option value="others" >Others</option>
					</select>
					<br/>
					<br/>
					<input type="button" id="doContactCreation" value="Save as Contact" />
				</form>
			 	<img style="display:none;" id="largeImage" src="" />
				<div class="img-div">
					<div class="btn">
						<img class="cameraBtn" id="listCards" src="img/business-card.png">
					</div>
					<div class="btn">
						<img class="cameraBtn" id="capturePhoto" src="img/camera.png">
					</div>
				</div>
			</content>
		</div>
		<footer>
			<script src="cards.js"></script>
			<script src="createDB.js"></script>
		</footer>
	</body>
</html>


<!-- [[{"cornerPoints":[{"x":1006,"y":1767},{"x":1016.1304321289062,"y":675.0469970703125},{"x":1105.1265869140625,"y":675.8726806640625},{"x":1094.9962158203125,"y":1767.8256225585938}],"text":"Hiren Mistry | M.: 9998066180","language":"en"}],[{"cornerPoints":[{"x":1314,"y":1784},{"x":1364.320068359375,"y":0.709716796875},{"x":1739.1708984375,"y":11.287109375},{"x":1688.850830078125,"y":1794.577392578125}],"text":"Md@cor","language":"en"}],[{"cornerPoints":[{"x":1705,"y":2133},{"x":1763.08544921875,"y":344.943115234375},{"x":1867.0306396484375,"y":348.31982421875},{"x":1808.9451904296875,"y":2136.376678466797}],"text":"Laminet & Kitchan Basket Galeri","language":""}],[{"cornerPoints":[{"x":2076,"y":2202},{"x":2115.911376953125,"y":293.417236328125},{"x":2213.889892578125,"y":295.466064453125},{"x":2173.978515625,"y":2204.048873901367}],"text":"F-3,4, Hari Krushna Complex, Petlad Road, Nadiad.","language":"en"},{"cornerPoints":[{"x":2202,"y":1811},{"x":2236.57958984375,"y":698.5372314453125},{"x":2330.5341796875,"y":701.4576416015625},{"x":2295.95458984375,"y":1813.9204711914062}],"text":"Email: ohmdecor@gmail.com","language":"en"}]] -->