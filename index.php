<?php
$pageTitle = "SMS TAMU";
?>
<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?> | Karibu</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, Helvetica, sans-serif;
            background: #090909;
            color: #f5f5f5;
            display: flex;
            flex-direction: column;
        }
        header {
            width: 100%;
            padding: 22px 7%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #242424;
        }
        .logo { font-size: 1.25rem; font-weight: 800; letter-spacing: 1px; }
        .logo span { color: #e9b44c; }
        .welcome {
            flex: 1;
            display: grid;
            place-items: center;
            text-align: center;
            padding: 70px 20px;
        }
        .content { max-width: 720px; }
        .eyebrow {
            color: #e9b44c;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: .8rem;
            font-weight: 700;
        }
        h1 {
            font-size: clamp(2.5rem, 7vw, 5rem);
            line-height: 1.05;
            margin: 20px 0;
        }
        h1 span { color: #e9b44c; }
        p {
            color: #bdbdbd;
            font-size: 1.1rem;
            line-height: 1.8;
            margin: 0 auto 32px;
            max-width: 560px;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: #e9b44c;
            color: #111;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
        }
        footer {
            padding: 20px;
            text-align: center;
            color: #777;
            border-top: 1px solid #242424;
            font-size: .85rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="logo">SMS <span>TAMU</span></div>
    </header>

    <main class="welcome">
        <section class="content">
            <div class="eyebrow">Karibu kwenye SMS TAMU</div>
            <h1>Maneno mazuri,<br><span>hisia za kweli.</span></h1>
            <p>
                Pata ujumbe mtamu wa kuonyesha upendo, kujali na kuthamini
                watu muhimu katika maisha yako.
            </p>
            <a class="button" href="#">Karibu</a>
        </section>
    </main>

    <footer>
        &copy; <?= date('Y') ?> SMS TAMU. Haki zote zimehifadhiwa.
    </footer>
</body>
</html>
