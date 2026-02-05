; 自定义安装脚本 - electron-builder NSIS
; 功能：1. 在路径后追加 test 子目录  2. 让用户选择是否创建快捷方式 

; 当用户通过浏览对话框选择目录后，自动追加项目名称子目录
Function .onVerifyInstDir
    ; 在安装路径末尾追加项目名子目录
    StrCpy $INSTDIR "$INSTDIR\${APP_PACKAGE_NAME}"
FunctionEnd

; 安装后询问用户是否创建快捷方式
!macro customInstall
    ; 询问用户是否创建桌面快捷方式
    MessageBox MB_YESNO|MB_ICONQUESTION "是否创建桌面快捷方式？" IDYES createDesktop IDNO skipDesktop
    createDesktop:
        CreateShortCut "$DESKTOP\${SHORTCUT_NAME}.lnk" "$INSTDIR\${PRODUCT_FILENAME}.exe"
    skipDesktop:
    
    ; 询问用户是否创建开始菜单快捷方式
    MessageBox MB_YESNO|MB_ICONQUESTION "是否创建开始菜单快捷方式？" IDYES createStartMenu IDNO skipStartMenu
    createStartMenu:
        CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
        CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${SHORTCUT_NAME}.lnk" "$INSTDIR\${PRODUCT_FILENAME}.exe"
        CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall ${PRODUCT_NAME}.lnk" "$INSTDIR\Uninstall ${PRODUCT_NAME}.exe"
    skipStartMenu:
!macroend

; 卸载时删除快捷方式
!macro customUnInstall
    Delete "$DESKTOP\${SHORTCUT_NAME}.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\${SHORTCUT_NAME}.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall ${PRODUCT_NAME}.lnk"
    RMDir "$SMPROGRAMS\${PRODUCT_NAME}"
!macroend