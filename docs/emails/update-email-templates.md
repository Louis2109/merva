# 📧 Configuration des Templates Email Supabase

## 1. CONFIRM SIGN UP Email Template

Go to: **Supabase Dashboard** → `Authentication` → `Email Templates` → `Confirm signup`

**Remplacer le Body HTML par:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmer votre inscription - Mervason</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td style="background: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; color: #FF8C00; font-size: 28px; font-weight: bold;">🎉 Bienvenue à Mervason!</h1>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Plateforme de Commerce pour le Cameroun</p>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="background: white; padding: 40px 30px;">
                <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                    Bonjour <strong>{{ .FirstName }}</strong>,
                </p>
                
                <p style="margin: 0 0 30px 0; color: #555; font-size: 15px; line-height: 1.6;">
                    Merci de vous être inscrit! Pour finir votre inscription et accéder à votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{{ .ConfirmationURL }}" style="background: #FF8C00; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        ✅ Confirmer mon email
                    </a>
                </div>
                
                <p style="margin: 30px 0 0 0; color: #999; font-size: 13px; line-height: 1.6;">
                    Ce lien expire dans <strong>24 heures</strong>. Si vous n'avez pas créé de compte, veuillez ignorer cet email.
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                    © 2026 Mervason. Tous droits réservés.<br>
                    <a href="{{ .SiteURL }}" style="color: #FF8C00; text-decoration: none;">Retour à Mervason</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

**Change aussi le Subject à:**
```
✅ Confirmez votre inscription Mervason
```

---

## 2. RESET PASSWORD Email Template

Go to: **Supabase Dashboard** → `Authentication` → `Email Templates` → `Reset password`

**Remplacer le Body HTML par:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialiser votre mot de passe - Mervason</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); margin: 0; padding: 20px;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td style="background: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; color: #FF8C00; font-size: 28px; font-weight: bold;">🔐 Réinitialiser votre mot de passe</h1>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Mervason - Sécurisez votre compte</p>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="background: white; padding: 40px 30px;">
                <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                    Bonjour,
                </p>
                
                <p style="margin: 0 0 30px 0; color: #555; font-size: 15px; line-height: 1.6;">
                    Vous avez demandé à réinitialiser votre mot de passe Mervason. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
                </p>
                
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #856404; font-size: 13px;">
                        ⚠️ <strong>Important:</strong> Ce lien expire dans <strong>1 heure</strong>. Utilisez-le rapidement!
                    </p>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{{ .ConfirmationURL }}" style="background: #FF8C00; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        🔑 Réinitialiser le mot de passe
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="margin: 20px 0 0 0; color: #999; font-size: 13px; line-height: 1.6;">
                    Vous n'avez pas demandé cette réinitialisation? Votre compte reste sécurisé. Ignorez simplement cet email.
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                    © 2026 Mervason. Tous droits réservés.<br>
                    <a href="{{ .SiteURL }}" style="color: #FF8C00; text-decoration: none;">Retour à Mervason</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

**Change aussi le Subject à:**
```
🔐 Réinitialiser votre mot de passe Mervason
```

---

## 3. INVITE USER Email Template (optionnel pour admin)

Go to: **Supabase Dashboard** → `Authentication` → `Email Templates` → `Invite user`

**Remplacer le Body HTML par:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation à rejoindre Mervason</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td style="background: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; color: #FF8C00; font-size: 28px; font-weight: bold;">📨 Invitation à Mervason</h1>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Rejoignez notre communauté de vendeurs</p>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="background: white; padding: 40px 30px;">
                <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                    Bonjour,
                </p>
                
                <p style="margin: 0 0 30px 0; color: #555; font-size: 15px; line-height: 1.6;">
                    Vous avez été invité à rejoindre <strong>Mervason</strong>, la plateforme de commerce leader pour le Cameroun. Créez votre compte et commencez à vendre dès maintenant!
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{{ .ConfirmationURL }}" style="background: #FF8C00; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        🚀 Accepter l'invitation
                    </a>
                </div>
                
                <p style="margin: 30px 0 0 0; color: #999; font-size: 13px; line-height: 1.6;">
                    Ce lien expire dans <strong>7 jours</strong>.
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                    © 2026 Mervason. Tous droits réservés.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

**Change aussi le Subject à:**
```
🚀 Vous êtes invité à rejoindre Mervason!
```

---

## 4. MAGIC LINK Email Template (optionnel pour connexion sans mdp)

Go to: **Supabase Dashboard** → `Authentication` → `Email Templates` → `Magic link`

**Remplacer le Body HTML par:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lien de connexion sécurisé - Mervason</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td style="background: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; color: #FF8C00; font-size: 28px; font-weight: bold;">🔗 Lien de Connexion</h1>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Mervason - Accès instantané</p>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="background: white; padding: 40px 30px;">
                <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                    Bonjour,
                </p>
                
                <p style="margin: 0 0 30px 0; color: #555; font-size: 15px; line-height: 1.6;">
                    Cliquez sur le lien ci-dessous pour vous connecter sécurisément à votre compte Mervason. Ce lien n'est valable qu'une seule fois.
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{{ .ConfirmationURL }}" style="background: #FF8C00; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                        ✅ Se connecter
                    </a>
                </div>
                
                <p style="margin: 30px 0 0 0; color: #999; font-size: 13px; line-height: 1.6;">
                    Ce lien expire dans <strong>24 heures</strong>.
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                    © 2026 Mervason. Tous droits réservés.<br>
                    <a href="{{ .SiteURL }}" style="color: #FF8C00; text-decoration: none;">Retour à Mervason</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

**Change aussi le Subject à:**
```
🔗 Votre lien de connexion Mervason
```

---

## 📝 RÉSUMÉ DES CHANGEMENTS

| Template | Subject | Caractéristiques |
|----------|---------|------------------|
| **Confirm Signup** | ✅ Confirmez votre inscription Mervason | HTML propre, couleurs Mervason, lien 24h |
| **Reset Password** | 🔐 Réinitialiser votre mot de passe Mervason | Alerte importante, lien 1h, message sécurité |
| **Invite User** | 🚀 Vous êtes invité à rejoindre Mervason! | Pour admin invitations, lien 7 jours |
| **Magic Link** | 🔗 Votre lien de connexion Mervason | Pour connexion sans mdp, lien 24h |

---

## ✅ ÉTAPES D'APPLICATION

1. ✅ Aller sur chaque template dans Supabase
2. ✅ Copier le HTML du template correspondant
3. ✅ Cliquer le bouton "Edit" en haut à droite du template
4. ✅ Remplacer le Body HTML
5. ✅ Changer le Subject
6. ✅ Cliquer "Save changes"

**Répéter pour chaque template!**
