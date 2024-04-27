Um simples projeto JS  para visualizar um byteStream que foi salvo.
A forma rotacionada posiciona cada byte em uma linha e o proximo byte dessa linha será um multiplo sucessor correspondente definido por "bytes por linha". Exemplo:
 A byteStream em Hex FF FE FD FC FB FA F9 F8 F7 F6 F5 F4 F3 F2 F1 F0 EF EE ED EC EB EA  pode ser arranjada na matriz:
 FF FE FD FC
 FB FA F9 F8
 F7 F6 F5 F4
 F3 F2 F1 F0
 EF EE ED EC
 EB EA
 onde "bytes por linha foi o divisor para organizar a visualização" a versão rotacionada ficaria:
FF FB F7 F3 EF EB
FE FA F6 F2 EE EA
FD F9 F5 F1 ED
FC F8 F4 F0 EC
Isso auxilia a visualição de oscilações em uma determinada posição ao longo do byteStream