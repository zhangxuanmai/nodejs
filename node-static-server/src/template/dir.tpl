<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>{{title}}</title>
	<style>
		a {
			display: block;
			font-size: 24px;
			text-decoration: none;
			color: #999;
		}

		a:hover {
			color: rgb(95, 95, 95);
		}
	</style>
</head>

<body>
	{{#each files}}
	<a href="{{../dir}}/{{file}}">【{{icon}}】{{file}}</a>
	{{/each}}
</body>

</html>