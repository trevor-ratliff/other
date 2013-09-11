static void SendMessageWithEmbeddedImages()
{
  string htmlMessage = "<html><body><img src='cid:EmbeddedContent_1' /></body></html>";

  SmtpClient client = new SmtpClient("mail.server.com");
  MailMessage msg = new MailMessage("noreply@deventerprise.net", "someone@deventerprise.net");

  // Create the HTML view
  AlternateView htmlView = AlternateView.CreateAlternateViewFromString(htmlMessage,
                                                                     Encoding.UTF8,
                                                                     MediaTypeNames.Text.Html);
  // Create a plain text message for client that don't support HTML
  AlternateView plainView = AlternateView.CreateAlternateViewFromString(Regex.Replace(htmlMessage, "<[^>]+?>", ""),
                                                                      Encoding.UTF8,
                                                                      MediaTypeNames.Text.Plain);

  string mediaType = MediaTypeNames.Image.Jpeg;
  LinkedResource img = new LinkedResource(@"C:\Images\MyImage.jpg", mediaType);

  // Make sure you set all these values!!!
  img.ContentId = "EmbeddedContent_1";
  img.ContentType.MediaType = mediaType;
  img.TransferEncoding = TransferEncoding.Base64;
  img.ContentType.Name = img.ContentId;
  img.ContentLink = new Uri("cid:" + img.ContentId);
  htmlView.LinkedResources.Add(img);
  //////////////////////////////////////////////////////////////

  msg.AlternateViews.Add(plainView);
  msg.AlternateViews.Add(htmlView);
  msg.IsBodyHtml = true;
  msg.Subject = "Some subject";

  client.Send(msg);
}