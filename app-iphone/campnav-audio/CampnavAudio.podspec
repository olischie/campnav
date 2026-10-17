Pod::Spec.new do |s|
  s.name = 'CampnavAudio'
  s.version = '1.0.0'
  s.summary = 'Voix de guidage de campnav et choix de la sortie du son.'
  s.license = 'MIT'
  s.homepage = 'https://github.com/olischie/campnav'
  s.author = 'olischie'
  s.source = { :git => 'https://github.com/olischie/campnav.git', :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.{swift,h,m}'
  s.ios.deployment_target = '14.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
end
