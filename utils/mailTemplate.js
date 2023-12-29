module.exports = ({ title = "", content = "", button }) => {
    return `
        <!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title class="text-center">Title</title>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=League+Spartan:wght@200;300;400;500;600;700&display=swap"
                rel="stylesheet"><!--<![endif]-->
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            <style type="text/css">
                .rollover:hover .rollover-first {
                    max-height: 0px !important;
                    display: none !important;
                }

                .rollover:hover .rollover-second {
                    max-height: none !important;
                    display: inline-block !important;
                }

                .rollover div {
                    font-size: 0px;
                }

                u~div img+div>div {
                    display: none;
                }

                #outlook a {
                    padding: 0;
                }

                span.MsoHyperlink,
                span.MsoHyperlinkFollowed {
                    color: inherit;
                    mso-style-priority: 99;
                }

                a.es-button {
                    mso-style-priority: 100 !important;
                    text-decoration: none !important;
                }

                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }

                .es-desk-hidden {
                    display: none;
                    float: left;
                    overflow: hidden;
                    width: 0;
                    max-height: 0;
                    line-height: 0;
                    mso-hide: all;
                }

                .es-button-border:hover>a.es-button {
                    color: #ffffff !important;
                }

                td .es-button-border:hover a.es-button-3327 {
                    color: #0e9f6e !important !important;
                }

                @media only screen and (max-width:600px) {
                    *[class="gmail-fix"] {
                        display: none !important
                    }

                    p,
                    a {
                        line-height: 150% !important
                    }

                    h1,
                    h1 a {
                        line-height: 120% !important
                    }

                    h2,
                    h2 a {
                        line-height: 120% !important
                    }

                    h3,
                    h3 a {
                        line-height: 120% !important
                    }

                    h4,
                    h4 a {
                        line-height: 120% !important
                    }

                    h5,
                    h5 a {
                        line-height: 120% !important
                    }

                    h6,
                    h6 a {
                        line-height: 120% !important
                    }

                    h1 {
                        font-size: 30px !important;
                        text-align: left
                    }

                    h2 {
                        font-size: 20px !important;
                        text-align: left
                    }

                    h3 {
                        font-size: 16px !important;
                        text-align: left
                    }

                    h4 {
                        font-size: 24px !important;
                        text-align: left
                    }

                    h5 {
                        font-size: 20px !important;
                        text-align: left
                    }

                    h6 {
                        font-size: 16px !important;
                        text-align: left
                    }

                    .es-header-body h1 a,
                    .es-content-body h1 a,
                    .es-footer-body h1 a {
                        font-size: 30px !important
                    }

                    .es-header-body h2 a,
                    .es-content-body h2 a,
                    .es-footer-body h2 a {
                        font-size: 20px !important
                    }

                    .es-header-body h3 a,
                    .es-content-body h3 a,
                    .es-footer-body h3 a {
                        font-size: 16px !important
                    }

                    .es-header-body h4 a,
                    .es-content-body h4 a,
                    .es-footer-body h4 a {
                        font-size: 24px !important
                    }

                    .es-header-body h5 a,
                    .es-content-body h5 a,
                    .es-footer-body h5 a {
                        font-size: 20px !important
                    }

                    .es-header-body h6 a,
                    .es-content-body h6 a,
                    .es-footer-body h6 a {
                        font-size: 16px !important
                    }

                    .es-menu td a {
                        font-size: 14px !important
                    }

                    .es-header-body p,
                    .es-header-body a {
                        font-size: 14px !important
                    }

                    .es-content-body p,
                    .es-content-body a {
                        font-size: 14px !important
                    }

                    .es-footer-body p,
                    .es-footer-body a {
                        font-size: 14px !important
                    }

                    .es-infoblock p,
                    .es-infoblock a {
                        font-size: 12px !important
                    }

                    .es-m-txt-c,
                    .es-m-txt-c h1,
                    .es-m-txt-c h2,
                    .es-m-txt-c h3,
                    .es-m-txt-c h4,
                    .es-m-txt-c h5,
                    .es-m-txt-c h6 {
                        text-align: center !important
                    }

                    .es-m-txt-r,
                    .es-m-txt-r h1,
                    .es-m-txt-r h2,
                    .es-m-txt-r h3,
                    .es-m-txt-r h4,
                    .es-m-txt-r h5,
                    .es-m-txt-r h6 {
                        text-align: right !important
                    }

                    .es-m-txt-j,
                    .es-m-txt-j h1,
                    .es-m-txt-j h2,
                    .es-m-txt-j h3,
                    .es-m-txt-j h4,
                    .es-m-txt-j h5,
                    .es-m-txt-j h6 {
                        text-align: justify !important
                    }

                    .es-m-txt-l,
                    .es-m-txt-l h1,
                    .es-m-txt-l h2,
                    .es-m-txt-l h3,
                    .es-m-txt-l h4,
                    .es-m-txt-l h5,
                    .es-m-txt-l h6 {
                        text-align: left !important
                    }

                    .es-m-txt-r img,
                    .es-m-txt-c img,
                    .es-m-txt-l img {
                        display: inline !important
                    }

                    .es-m-txt-r .rollover:hover .rollover-second,
                    .es-m-txt-c .rollover:hover .rollover-second,
                    .es-m-txt-l .rollover:hover .rollover-second {
                        display: inline !important
                    }

                    .es-m-txt-r .rollover div,
                    .es-m-txt-c .rollover div,
                    .es-m-txt-l .rollover div {
                        line-height: 0 !important;
                        font-size: 0 !important
                    }

                    .es-spacer {
                        display: inline-table
                    }

                    a.es-button,
                    button.es-button {
                        font-size: 14px !important
                    }

                    a.es-button,
                    button.es-button {
                        display: inline-block !important
                    }

                    .es-button-border {
                        display: inline-block !important
                    }

                    .es-m-fw,
                    .es-m-fw.es-fw,
                    .es-m-fw .es-button {
                        display: block !important
                    }

                    .es-m-il,
                    .es-m-il .es-button,
                    .es-social,
                    .es-social td,
                    .es-menu {
                        display: inline-block !important
                    }

                    .es-adaptive table,
                    .es-left,
                    .es-right {
                        width: 100% !important
                    }

                    .es-content table,
                    .es-header table,
                    .es-footer table,
                    .es-content,
                    .es-footer,
                    .es-header {
                        width: 100% !important;
                        max-width: 600px !important
                    }

                    .adapt-img {
                        width: 100% !important;
                        height: auto !important
                    }

                    .es-mobile-hidden,
                    .es-hidden {
                        display: none !important
                    }

                    .es-desk-hidden {
                        width: auto !important;
                        overflow: visible !important;
                        float: none !important;
                        max-height: inherit !important;
                        line-height: inherit !important
                    }

                    tr.es-desk-hidden {
                        display: table-row !important
                    }

                    table.es-desk-hidden {
                        display: table !important
                    }

                    td.es-desk-menu-hidden {
                        display: table-cell !important
                    }

                    .es-menu td {
                        width: 1% !important
                    }

                    table.es-table-not-adapt,
                    .esd-block-html table {
                        width: auto !important
                    }

                    .es-social td {
                        padding-bottom: 10px
                    }

                    .h-auto {
                        height: auto !important
                    }
                }
            </style>
        </head>

        <body style="width:100%;height:100%;padding:0;Margin:0">
            <div class="es-wrapper-color" style="background-color:#F6F6F6"><!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                        <v:fill type="tile" color="#f6f6f6"></v:fill>
                    </v:background>
                <![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                    <tr>
                        <td valign="top" style="padding:0;Margin:0">
                            <table class="es-header" cellspacing="0" cellpadding="0" align="center"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff"
                                            align="center"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                                            <tr>
                                                <td align="left"
                                                    style="Margin:0;padding-top:15px;padding-right:20px;padding-bottom:15px;padding-left:20px">
                                                    <table cellspacing="0" cellpadding="0" width="100%"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:560px">
                                                                <table width="100%" cellspacing="0" cellpadding="0"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;font-size:0px"><a
                                                                                target="_blank"
                                                                                href="https://devapp.dayratework.com/"
                                                                                style="mso-line-height-rule:exactly;text-decoration:underline;color:#6B7280;font-size:14px">
                                                                                <img
                                                                                    src="https://devapp.dayratework.com/_next/static/media/logo_dayratework.9c1e0a00.png"
                                                                                    alt="DayrateWork Logo"
                                                                                    style="display:block;font-size:16px;border:0;outline:none;text-decoration:none;height: 30px; width: auto;"
                                                                                    width="85" title="DayrateWork Logo"
                                                                                    height="32"></a></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <!-- <table class="es-content" cellspacing="0" cellpadding="0" align="center"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                                <tr>
                                    <td align="center" bgcolor="transparent" style="padding:0;Margin:0">
                                        <table class="es-content-body" cellpadding="0" cellspacing="0" bgcolor="transparent"
                                            align="center"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
                                                    <table cellpadding="0" cellspacing="0"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="center" style="padding:0;Margin:0">
                                                                            <h2
                                                                                style="Margin:0;text-align:center;font-family:Inter, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:bold;line-height:29px;color:#111928">
                                                                                ${title}</h2>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table> -->

                            <table class="es-content" cellspacing="0" cellpadding="0" align="center"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table class="es-content-body" cellspacing="0" cellpadding="0" align="center"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                                            <tr>
                                                <td align="left" style="padding:15px;Margin:0">
                                                    <table width="100%" cellspacing="0" cellpadding="0"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td valign="top" align="center"
                                                                style="padding:0;Margin:0;width:570px">
                                                                <table width="100%" cellspacing="0" cellpadding="0"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-width:1px;border-style:solid;border-color:#e5e7eb;border-radius:8px 8px 0px 0px;background-color:#ffffff"
                                                                    bgcolor="#ffffff" role="presentation">
                                                                    <tr>
                                                                        <td align="left" style="padding:15px;Margin:0">
                                                                            <h2
                                                                                style="Margin:0;font-family:Inter, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:bold;line-height:36px;color:#111928;text-align: center;">
                                                                                ${title}</h2>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="padding:0;Margin:0;padding-right:20px;padding-left:15px">
                                                                            <div style="padding: 10px 10px;">
                                                                                ${content}
                                                                            </div>

                                                                        </td>
                                                                    </tr>
                                                                    ${button ?
                                                                        `
                                                                            <tr>
                                                                                <td align="center"
                                                                                    style="padding:0;Margin:0;padding-bottom:15px">
                                                                                    <span class="es-button-border msohide"
                                                                                        style="border-style:solid;border-color:#1C64F2;background:#1C64F2;border-width:0px;display:inline-block;border-radius:8px;width:auto;mso-hide:all">
                                                                                        <a href="${button.link}"
                                                                                            class="es-button" target="_blank"
                                                                                            style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;padding:10px 20px 10px 20px;display:inline-block;background:#1C64F2;border-radius:8px;font-family:Inter, sans-serif;font-weight:bold;font-style:normal;line-height:17px !important;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #1C64F2">
                                                                                            ${button.text}
                                                                                            <!-- <img
                                                                                                src="lets.getpress.ai/images/arrowright.png"
                                                                                                alt="icon" width="20" align="absmiddle"
                                                                                                style="display:inline-block;font-size:16px;border:0;outline:none;text-decoration:none;vertical-align:middle;margin-left:10px"
                                                                                                height="20"> -->
                                                                                        </a>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        `: ''}
                                                                    ${acceptbutton ?
                                                                        `
                                                                            <tr>
                                                                                <td align="center"
                                                                                    style="padding:0;Margin:0;padding-bottom:15px">
                                                                                    <span class="es-button-border msohide"
                                                                                        style="border-style:solid;border-color:#1C64F2;background:#1C64F2;border-width:0px;display:inline-block;border-radius:8px;width:auto;mso-hide:all; display: flex">
                                                                                        <form action="${acceptbutton.acceptlink} method="post">
                                                                                            <input type="hidden" name="userid" value="${acceptbutton.userid}"/>
                                                                                            <input type="hidden" name="jobid" value="${acceptbutton.jobid}"/>
                                                                                            <input type="submit" class="es-button" target="_blank"
                                                                                            style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;padding:10px 20px 10px 20px;display:inline-block;background:#1C64F2;border-radius:8px;font-family:Inter, sans-serif;font-weight:bold;font-style:normal;line-height:17px !important;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #1C64F2">
                                                                                             value="Accept"/>
                                                                                        </form>
                                                                                        <form action="${acceptbutton.rejectlink} method="post">
                                                                                            <input type="hidden" name="userid" value="${acceptbutton.userid}"/>
                                                                                            <input type="hidden" name="jobid" value="${acceptbutton.jobid}"/>
                                                                                            <input type="submit" class="es-button" target="_blank"
                                                                                            style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:14px;padding:10px 20px 10px 20px;display:inline-block;background:#1C64F2;border-radius:8px;font-family:Inter, sans-serif;font-weight:bold;font-style:normal;line-height:17px !important;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #1C64F2">
                                                                                             value="Reject"/>
                                                                                        </form>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        `: ''}
                                                                    
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table class="es-footer" cellspacing="0" cellpadding="0" align="center"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff"
                                            align="center"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                                            <tr>
                                                <td align="left" style="padding:15px;Margin:0">
                                                    <table cellspacing="0" cellpadding="0" width="100%"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:570px">
                                                                <table width="100%" cellspacing="0" cellpadding="0"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="center" class="es-text-9381"
                                                                            style="padding:0;Margin:0;font-size:12px !important">
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:Inter, sans-serif;line-height:18px;letter-spacing:0;color:#6B7280;font-size:12px !important">
                                                                                © 2023 dayratework.com. All rights reserved.</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        <script>
            $('#accept').click(function(e) {
                e.preventDefault();
                $.ajax({ 
                    method: 'POST', 
                    url: ${acceptbutton.acceptlink},    
                    dataType: 'JSON',
                    data: { 
                        "jobid" : ${acceptbutton.jobid},
                        "userid" : ${acceptbutton.userid}
                    }	, 
                    success: function(res){    
                        console.log(res)
                        window.location.href = "index.html"
                    }, 
                    error: function(e){  
                        console.log(e)
                        window.location.href = "index.html"
                        alert('Error while request..' + e['responseText']); 
                    } 
                });
            })
            $('#reject').click(function(e) {
                e.preventDefault();
                $.ajax({ 
                    method: 'POST', 
                    url: ${acceptbutton.rejectlink},    
                    dataType: 'JSON',
                    data: { 
                        "jobid" : ${acceptbutton.jobid},
                        "userid" : ${acceptbutton.userid}
                    }	, 
                    success: function(res){    
                        console.log(res)
                        window.location.href = "index.html"
                    }, 
                    error: function(e){  
                        console.log(e)
                        window.location.href = "index.html"
                        alert('Error while request..' + e['responseText']); 
                    } 
                });
            })
        </script>
        </html>
    `
}